
import { Card, CardContent } from "@/components/ui/card"

export default function LegendControl() {
    return (
        <Card className="bg-background/80 backdrop-blur-sm w-56">
            <CardContent className="p-3">
                <p className="text-sm font-medium">
                    Legenda: <span className="font-bold text-primary">Indicador</span>
                </p>
                <div className="w-full h-4 rounded-full mt-2 bg-gradient-to-r from-yellow-300 via-orange-400 to-fuchsia-600"></div>
                <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                    <span>Baixa Prioridade</span>
                    <span>Alta Prioridade</span>
                </div>
            </CardContent>
        </Card>
    )
}
