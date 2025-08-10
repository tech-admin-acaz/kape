
import { Card, CardContent } from "@/components/ui/card"
import type { LayerState } from "./layer-control";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface LegendControlProps {
    layerId: keyof LayerState;
    onClose: () => void;
}

const legendData: Record<keyof LayerState, { title: string; content: React.ReactNode }> = {
    indicator: {
        title: 'Indicador',
        content: (
            <>
                <div className="w-full h-4 rounded-full mt-2 bg-gradient-to-r from-yellow-300 via-orange-400 to-fuchsia-600"></div>
                <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                    <span>Baixa Prioridade</span>
                    <span>Alta Prioridade</span>
                </div>
            </>
        )
    },
    restoredCarbon: {
        title: 'Carbono Restaurado',
        content: (
            <>
                <div className="w-full h-4 rounded-full mt-2 bg-gradient-to-r from-green-600 via-yellow-400 to-red-600"></div>
                <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                    <span>668 tCO2e</span>
                    <span>0 tCO2e</span>
                </div>
            </>
        )
    },
    currentCarbon: {
        title: 'Carbono Atual',
        content: (
            <>
                <div className="w-full h-4 rounded-full mt-2 bg-gradient-to-r from-green-600 via-yellow-400 to-red-600"></div>
                <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                    <span>668 tCO2e</span>
                    <span>0 tCO2e</span>
                </div>
            </>
        )
    },
    opportunityCost: {
        title: 'Custo de Oportunidade',
        content: (
            <>
                <div className="w-full h-4 rounded-full mt-2 bg-gradient-to-r from-purple-800 via-yellow-400 to-red-600"></div>
                <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                    <span>0</span>
                    <span>2874</span>
                </div>
            </>
        )
    },
    restorationCost: {
        title: 'Custo de Restauracao',
        content: (
            <>
                <div className="w-full h-4 rounded-full mt-2 bg-gradient-to-r from-purple-800 via-yellow-400 to-red-600"></div>
                <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                    <span>0</span>
                    <span>35636</span>
                </div>
            </>
        )
    },
    mapbiomas: {
        title: 'Mapbiomas Categorizado',
        content: (
            <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs"><div className="w-4 h-4 rounded-sm bg-[#1f8d49]"></div><span>Formação Florestal</span></div>
                <div className="flex items-center gap-2 text-xs"><div className="w-4 h-4 rounded-sm bg-[#4169E1]"></div><span>Outra Formações Naturais</span></div>
                <div className="flex items-center gap-2 text-xs"><div className="w-4 h-4 rounded-sm bg-[#FFA500]"></div><span>Outros</span></div>
                <div className="flex items-center gap-2 text-xs"><div className="w-4 h-4 rounded-sm bg-[#FF00FF]"></div><span>Agricultura</span></div>
                <div className="flex items-center gap-2 text-xs"><div className="w-4 h-4 rounded-sm bg-[#FFFF00]"></div><span>Pastagem</span></div>
            </div>
        )
    }
};


export default function LegendControl({ layerId, onClose }: LegendControlProps) {
    const data = legendData[layerId];

    if (!data) return null;

    return (
        <Card className="bg-background/80 backdrop-blur-sm w-56 shadow-md relative">
            <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={onClose}>
                <X className="h-4 w-4" />
            </Button>
            <CardContent className="p-3">
                <p className="text-sm font-medium">
                    Legenda: <span className="font-bold text-primary">{data.title}</span>
                </p>
                {data.content}
            </CardContent>
        </Card>
    )
}

    