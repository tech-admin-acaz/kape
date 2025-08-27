
# Detalhamento Técnico da Plataforma Kapé

**Versão do Documento:** 1.0
**Data:** 25 de Julho de 2024

## 1. Visão Geral da Arquitetura

A plataforma Kapé é uma aplicação web moderna construída com uma arquitetura robusta e escalável para análise de dados ambientais. Ela combina uma interface de usuário interativa e responsiva no front-end com um back-end poderoso para processamento de dados geoespaciais e integração com inteligência artificial generativa.

A arquitetura foi projetada com os seguintes princípios em mente:

-   **Performance:** Utilização de renderização no servidor (SSR) e componentes de servidor para carregamento rápido e uma experiência de usuário fluida.
-   **Escalabilidade:** Infraestrutura baseada em nuvem que se ajusta dinamicamente à demanda.
-   **Manutenibilidade:** Código limpo, modular e bem documentado, seguindo as melhores práticas de desenvolvimento.
-   **Segurança:** Autenticação robusta e comunicação segura entre o cliente e o servidor.

---

## 2. Tecnologias do Front-End

O front-end é responsável por toda a interface com o usuário, incluindo o mapa interativo, painéis de estatísticas e a experiência de login/cadastro.

| Tecnologia/Biblioteca | Versão* | Propósito na Aplicação |
| :--- | :--- | :--- |
| **Next.js** | ~15.3 | Framework React principal, utilizado pelo App Router para renderização no servidor (SSR), Componentes de Servidor e otimizações de performance. |
| **React** | ~18.3 | Biblioteca fundamental para a construção da interface de usuário declarativa e baseada em componentes. |
| **TypeScript** | ~5.0 | Superset do JavaScript que adiciona tipagem estática para maior segurança e manutenibilidade do código. |
| **Tailwind CSS** | ~3.4 | Framework de CSS utility-first para estilização rápida e consistente, permitindo a criação de um design system customizável. |
| **ShadCN/UI** | N/A | Coleção de componentes de UI reutilizáveis, acessíveis e customizáveis, construídos sobre Radix UI e Tailwind CSS. |
| **Mapbox GL JS** | ~3.4 | Biblioteca de renderização de mapas de alta performance para a criação do mapa interativo. |
| **Highcharts** | ~11.4 | Biblioteca para a criação de gráficos interativos e visualizações de dados nos painéis de estatísticas. |
| **Lucide React** | ~0.475 | Biblioteca de ícones SVG, utilizada para garantir consistência visual em toda a interface. |
| **Firebase (Client SDK)** | ~11.9 | Utilizado para a autenticação de usuários (Email/Senha e Google) diretamente no cliente. |

_*Versões aproximadas com base no `package.json`._

### Estrutura de Arquivos do Front-End:

-   **/src/app/**: Contém as rotas da aplicação, seguindo a convenção do Next.js App Router. Cada pasta representa um segmento de URL.
-   **/src/components/**: Organizado por funcionalidade (e.g., `dashboard`, `landing`, `auth`), contém os componentes React reutilizáveis.
-   **/src/hooks/**: Armazena hooks customizados, como `useI18n` para internacionalização.
-   **/src/lib/**: Utilitários e configurações, como o `i18n.tsx` para tradução e `firebase.ts` para inicialização do Firebase.
-   **/src/services/**: Lógica de acesso a dados, como o `map.service.ts`, que centraliza as chamadas às APIs do back-end.

---

## 3. Tecnologias do Back-End

O back-end é composto por uma série de APIs serverless (API Routes do Next.js) que atuam como um proxy seguro e um orquestrador de dados.

| Tecnologia/Serviço | Propósito na Aplicação |
| :--- | :--- |
| **Next.js API Routes** | Criação de endpoints de API serverless para servir como proxy entre o cliente e a API externa de dados ambientais (API_BIO). |
| **Firebase Authentication** | Serviço gerenciado para autenticação de usuários, garantindo acesso seguro aos recursos da plataforma. |
| **Genkit (AI Framework)** | Framework para orquestração de fluxos de inteligência artificial, executado no ambiente de servidor do Next.js. |
| **Google AI (Gemini)** | Modelo de linguagem de grande escala (LLM) que alimenta o fluxo de correlação de dados do Genkit. |

### Estrutura de Arquivos do Back-End:

-   **/src/app/api/**: Contém todas as API Routes. A estrutura de pastas define os endpoints. Por exemplo, `/api/locations/[type]/route.ts` lida com requisições para `/api/locations/estado`.
-   **/src/actions/**: Armazena as Server Actions do Next.js, como a `runCorrelation`, que conecta a UI ao pipeline de IA de forma segura.
-   **/src/ai/**: Diretório dedicado à lógica de inteligência artificial.
    -   **/src/ai/genkit.ts**: Arquivo de configuração central do Genkit, onde plugins e modelos são registrados.
    -   **/src/ai/flows/**: Contém os fluxos de IA, como o `dataset-correlation.ts`, que define o prompt e a lógica de interação com o modelo Gemini.

---

## 4. Pipeline de Inteligência Artificial (Análise de Correlação)

A funcionalidade "Aprofundar Análise com IA" é implementada através de um pipeline server-side bem definido, garantindo segurança e performance.

### Arquitetura do Pipeline:

1.  **Interface do Usuário (Client-Side):**
    -   O componente `AICorrelator` (`/src/components/dashboard/ai-correlator.tsx`) renderiza o pop-up e o formulário.
    -   Quando o usuário submete a descrição de um novo dataset, o componente **não** chama a IA diretamente. Em vez disso, ele invoca uma **Next.js Server Action**.

2.  **Server Action (Back-End Seguro):**
    -   A função `runCorrelation` em `/src/actions/ai.ts` é acionada. Esta função é executada exclusivamente no servidor.
    -   Sua principal responsabilidade é chamar o fluxo Genkit, passando os dados recebidos do cliente.

3.  **Genkit Flow (Orquestração da IA):**
    -   O fluxo `correlateDatasetsFlow`, definido em `/src/ai/flows/dataset-correlation.ts`, recebe a chamada da Server Action.
    -   **Definição de Esquemas (Zod):** Utiliza a biblioteca `Zod` para definir e validar os formatos de entrada (`CorrelateDatasetsInputSchema`) e saída (`CorrelateDatasetsOutputSchema`). Isso garante que a IA sempre receba e retorne dados estruturados e previsíveis.
    -   **Construção do Prompt:** O fluxo insere a descrição do novo dataset, juntamente com descrições predefinidas das visualizações e insights existentes, em um template de prompt.
    -   **Chamada ao Modelo:** O `prompt` configurado é executado, enviando a requisição para o modelo **Gemini** através do plugin do Google AI.

4.  **Modelo de IA (Gemini):**
    -   O Gemini processa o prompt, analisa a correlação entre os datasets e gera uma resposta no formato JSON especificado pelo `CorrelateDatasetsOutputSchema`.

5.  **Retorno e Exibição:**
    -   A resposta estruturada do Gemini é retornada pelo fluxo Genkit, passa pela Server Action e chega de volta ao componente `AICorrelator` no front-end.
    -   O componente atualiza seu estado e exibe os `insights` e `suggestedUpdates` na interface.

Este design desacoplado oferece várias vantagens:

-   **Segurança:** Chaves de API e a lógica do prompt nunca são expostas ao navegador.
-   **Performance:** A lógica pesada é executada no servidor, liberando o cliente.
-   **Organização:** A separação de responsabilidades (UI, Ação, Fluxo de IA) torna o código mais limpo e fácil de manter.


