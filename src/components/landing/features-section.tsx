"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, BarChartBig, BrainCircuit } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

const features = [
  {
    icon: Map,
    titleKey: 'feature1Title',
    descriptionKey: 'feature1Desc',
  },
  {
    icon: BarChartBig,
    titleKey: 'feature2Title',
    descriptionKey: 'feature2Desc',
  },
  {
    icon: BrainCircuit,
    titleKey: 'feature3Title',
    descriptionKey: 'feature3Desc',
  },
];

export function FeaturesSection() {
    const { t } = useI18n();
    return (
        <section id="features" className="w-full py-20 md:py-32">
            <div className="container">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        {t('featuresTitle')}
                    </h2>
                </div>
                <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-1 md:grid-cols-3">
                    {features.map((feature) => (
                        <Card key={feature.titleKey} className="text-center">
                            <CardHeader className="items-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                                    <feature.icon className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="font-headline text-xl font-semibold">
                                    {t(feature.titleKey as any)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t(feature.descriptionKey as any)}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
