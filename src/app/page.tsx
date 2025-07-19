import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { TimelineNav } from '@/components/landing/timeline-nav';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <TimelineNav />
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
