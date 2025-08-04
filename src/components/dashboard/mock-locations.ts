
export type Location = {
    value: string;
    label: string;
};

export const territoryTypes: Location[] = [
    { value: 'estado', label: 'Estado' },
    { value: 'municipio', label: 'Município' },
    { value: 'ti', label: 'Terra Indígena' },
    { value: 'uc', label: 'Unidade de Conservação' },
];

export type TerritoryTypeKey = 'estado' | 'municipio' | 'ti' | 'uc';

export const locationsData: Record<TerritoryTypeKey, Location[]> = {
    estado: [
        { value: 'acre', label: 'Acre' },
        { value: 'sao_paulo_estado', label: 'São Paulo' },
    ],
    municipio: [
        { value: 'rio_branco', label: 'Rio Branco' },
        { value: 'sao_paulo_cidade', label: 'São Paulo (Cidade)' },
    ],
    ti: [
        { value: 'yanomami', label: 'T.I. Yanomami' },
        { value: 'xingu', label: 'P.I. do Xingu' },
    ],
    uc: [
        { value: 'canastra', label: 'P.N. Serra da Canastra' },
        { value: 'iguacu', label: 'P.N. do Iguaçu' },
        { value: 'pico_neblina', label: 'P.N. Pico da Neblina' },
    ],
};
