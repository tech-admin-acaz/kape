
import type { StatsData } from './stats-panel';

const mockSpecies = [
    { id: '1', name: 'Alibertia latifolia', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '2', name: 'Bellucia klugii', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '3', name: 'Bellucia subandina', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '4', name: 'Coussarea flava', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '5', name: 'Coussarea grandis', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '6', name: 'Coussarea hirticalyx', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '7', name: 'Coussarea hydrangeifolia', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '8', name: 'Coussarea klugii', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '9', name: 'Coussarea paniculata', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '10', name: 'Coussarea rudgeoides', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '11', name: 'Coussarea violacea', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '12', name: 'Dipteryx lacunifera', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '13', name: 'Graffenrieda intermedia', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '14', name: 'Graffenrieda rupestris', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '15', name: 'Henriettea caudata', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '16', name: 'Henriettea loretensis', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '17', name: 'Euterpe oleracea', resilience: '4 - Alta', potential: true, domestication: true, availability: true },
    { id: '18', name: 'Theobroma cacao', resilience: '3 - Média', potential: true, domestication: true, availability: true },
    { id: '19', name: 'Bertholletia excelsa', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: true },
    { id: '20', name: 'Paullinia cupana', resilience: '4 - Alta', potential: true, domestication: true, availability: true },
    { id: '21', name: 'Bactris gasipaes', resilience: '4 - Alta', potential: true, domestication: true, availability: true },
    { id: '22', name: 'Mauritia flexuosa', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: true },
    { id: '23', name: 'Myrciaria dubia', resilience: '3 - Média', potential: true, domestication: true, availability: false },
    { id: '24', name: 'Carapa guianensis', resilience: '4 - Alta', potential: true, domestication: false, availability: true },
    { id: '25', name: 'Hevea brasiliensis', resilience: '3 - Média', potential: true, domestication: true, availability: true },
    { id: '26', name: 'Anacardium occidentale', resilience: '4 - Alta', potential: true, domestication: true, availability: true },
    { id: '27', name: 'Hymenaea courbaril', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '28', name: 'Genipa americana', resilience: '4 - Alta', potential: true, domestication: true, availability: true },
    { id: '29', name: 'Annona muricata', resilience: '3 - Média', potential: true, domestication: true, availability: true },
    { id: '30', name: 'Psidium guajava', resilience: '3 - Média', potential: true, domestication: true, availability: true },
];

const generateFutureClimateData = (startYear: number, endYear: number, startValue: number, valueRange: number, trendStart: number, trendEnd: number) => {
    const data = [];
    const yearCount = endYear - startYear;
    for (let i = 0; i <= yearCount; i++) {
        const year = startYear + i;
        const value = startValue + (Math.random() - 0.5) * valueRange;
        const trend = trendStart + ((trendEnd - trendStart) / yearCount) * i;
        data.push({ year: year.toString(), value: parseFloat(value.toFixed(2)), trend: parseFloat(trend.toFixed(2)) });
    }
    return data;
};

export const mockData: Record<string, StatsData> = {
  "1": {
    id: "1",
    name: "T.I. Yanomami",
    type: "Indigenous Territory",
    typeKey: "ti",
    generalInfo: {
        state: "Roraima (RR)",
        municipality: "Undefined",
        territoryName: "T.I. Yanomami",
        conservationUnit: "Undefined",
    },
    stats: {
      landCover: [
        { name: "Formação Florestal Primária", y: 36.2, color: "hsl(var(--chart-3))" },
        { name: "Outras Formações Naturais", y: 24.5, color: "hsl(var(--chart-2))" },
        { name: "Pastagem", y: 24.2, color: "hsl(var(--chart-4))" },
        { name: "Agricultura", y: 13.3, color: "hsl(var(--chart-5))" },
        { name: "Outros", y: 1.8, color: "hsl(var(--muted))" },
      ],
      waterQuality: 78,
      vegetationIndex: 92,
    },
    environmentalServices: {
      carbon: {
        currentAndRestorable: [], // This will be fetched dynamically
        valuation: [], // This will be fetched dynamically
      },
      water: {
        valuation: [
            { name: "Balanço Hídrico", value: 2300000000 },
            { name: "Qualidade da Água", value: 1200000000 },
            { name: "Recarga de Aquífero", value: 850000000 },
        ]
      }
    },
    correlationInsights: "Recent satellite data shows a 2% increase in deforestation on the eastern border, likely linked to illegal mining activities.",
    species: mockSpecies,
    futureClimate: {
      temperature: generateFutureClimateData(2014, 2042, 26.5, 2, 26.2, 27.5),
      precipitation: generateFutureClimateData(2014, 2042, 1450, 400, 1450, 1350),
    },
  },
  "2": {
    id: "2",
    name: "Serra da Canastra",
    type: "National Park",
    typeKey: 'uc',
    generalInfo: {
        state: "Minas Gerais (MG)",
        municipality: "Undefined",
        territoryName: "Undefined",
        conservationUnit: "P.N. Serra da Canastra",
    },
    stats: {
      landCover: [
        { name: "Formação Florestal Primária", y: 20, color: "hsl(var(--chart-3))" },
        { name: "Outras Formações Naturais", y: 60, color: "hsl(var(--chart-2))" },
        { name: "Pastagem", y: 15, color: "hsl(var(--chart-4))" },
        { name: "Agricultura", y: 5, color: "hsl(var(--chart-5))" },
        { name: "Outros", y: 0, color: "hsl(var(--muted))" },
      ],
      waterQuality: 95,
      vegetationIndex: 88,
    },
    environmentalServices: {
      carbon: {
        currentAndRestorable: [], // This will be fetched dynamically
        valuation: [], // This will be fetched dynamically
      },
       water: {
        valuation: [
            { name: "Balanço Hídrico", value: 3300000000 },
            { name: "Qualidade da Água", value: 2200000000 },
            { name: "Recarga de Aquífero", value: 1850000000 },
        ]
      }
    },
    correlationInsights: "The park's water sources remain pristine, showing high resilience to surrounding agricultural activities.",
    species: mockSpecies.slice().reverse(), // just to show different data
    futureClimate: {
      temperature: generateFutureClimateData(2014, 2042, 22, 2.5, 21.8, 24.5),
      precipitation: generateFutureClimateData(2014, 2042, 1300, 350, 1300, 1200),
    },
  },
};
