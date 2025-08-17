import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { TimelineNav } from '@/components/landing/timeline-nav';
import { Footer } from '@/components/landing/footer';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';
import { BiodiversitySection } from '@/components/landing/biodiversity-section';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <TimelineNav />
      
      <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-4">
        <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
            <Instagram className="h-5 w-5" />
        </Link>
        <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
            <Facebook className="h-5 w-5" />
        </Link>
        <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
            <Twitter className="h-5 w-5" />
        </Link>
      </div>
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <BiodiversitySection />
      </main>
      <Footer />
    </div>
  );
}
