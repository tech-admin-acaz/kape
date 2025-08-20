
import { Card, CardContent } from "@/components/ui/card"
import type { LayerState } from "./layer-control";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface LegendControlProps {
    layerId: keyof LayerState;
    onClose: () => void;
}

const LegendContent = ({ layerId }: { layerId: keyof LayerState }) => {
    const { t } = useI18n();
    const legendData: Record<keyof LayerState, { title: string; content: React.ReactNode }> = {
        indicator: {
            title: t('layerIndicator'),
            content: (
                <>
                    <div className="w-full h-4 rounded-full mt-2 bg-gradient-to-r from-yellow-300 via-orange-400 to-fuchsia-600"></div>
                    <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                        <span>{t('lowPriority')}</span>
                        <span>{t('highPriority')}</span>
                    </div>
                </>
            )
        },
        restoredCarbon: {
            title: t('layerRestoredCarbon'),
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
            title: t('layerCurrentCarbon'),
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
            title: t('layerOpportunityCost'),
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
            title: t('layerRestorationCost'),
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
            title: t('layerMapbiomas'),
            content: (
                <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs"><div className="w-4 h-4 rounded-sm bg-[#3AA462]"></div><span>{t('landCoverForest')}</span></div>
                    <div className="flex items-center gap-2 text-xs"><div className="w-4 h-4 rounded-sm bg-[#007785]"></div><span>{t('landCoverOtherNatural')}</span></div>
                    <div className="flex items-center gap-2 text-xs"><div className="w-4 h-4 rounded-sm bg-[#FC8114]"></div><span>{t('landCoverOther')}</span></div>
                    <div className="flex items-center gap-2 text-xs"><div className="w-4 h-4 rounded-sm bg-[#E974ED]"></div><span>{t('landCoverAgriculture')}</span></div>
                    <div className="flex items-center gap-2 text-xs"><div className="w-4 h-4 rounded-sm bg-[#EADB89]"></div><span>{t('landCoverPasture')}</span></div>
                </div>
            )
        }
    };

    const data = legendData[layerId];
    if (!data) return null;

    return (
        <>
            <p className="text-sm font-medium">
                {t('legend')}: <span className="font-bold text-primary">{data.title}</span>
            </p>
            {data.content}
        </>
    )
}


export default function LegendControl({ layerId, onClose }: LegendControlProps) {
    return (
        <Card className="bg-background/80 backdrop-blur-sm w-56 shadow-md relative">
            <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={onClose}>
                <X className="h-4 w-4" />
            </Button>
            <CardContent className="p-3">
                <LegendContent layerId={layerId} />
            </CardContent>
        </Card>
    )
}
