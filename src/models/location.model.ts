
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
