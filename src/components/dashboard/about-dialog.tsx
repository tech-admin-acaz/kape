"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { Logo }s from '../shared/logo';
import { useI18n } from '@/hooks/use-i18n';

export function AboutDialog({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const projectVersion = "2.0.0";

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="items-center text-center">
          <Logo />
          <DialogTitle className="text-2xl font-bold font-headline mt-2">{t('appName')}</DialogTitle>
          <p className="text-sm text-muted-foreground">Versão {projectVersion}</p>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Esta plataforma apresenta a quantificação de serviços ambientais e a detecção de áreas prioritárias para a restauração na Amazônia com base em três pilares: (i) valoração dos serviços ambientais de florestas de terra firme relacionados ao carbono, biodiversidade e água; (ii) sugestão de espécies-chave a serem usadas na restauração, que possam aumentar a resiliência das florestas frente às mudanças climáticas futuras e proporcionar benefícios econômicos para as comunidades locais; e (iii) integração do conhecimento tradicional com a ciência ocidental.
          </p>
        </div>
        <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Fechar
                </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
