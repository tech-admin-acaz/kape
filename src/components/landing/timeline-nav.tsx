"use client"

import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { useI18n } from "@/hooks/use-i18n";

const sections: { id: string, key: 'navIntro' | 'navFeatures' }[] = [
    { id: 'hero', key: 'navIntro' },
    { id: 'features', key: 'navFeatures' },
];

export function TimelineNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const { t } = useI18n();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);
  
  return (
    <nav className="fixed left-8 top-1/2 z-50 hidden -translate-y-1/2 transform md:block">
      <ul className="space-y-6">
        {sections.map((section) => (
          <li key={section.id} className="group flex items-center gap-3">
             <a
              href={`#${section.id}`}
              className={cn(
                "block h-2.5 w-2.5 rounded-full transition-all duration-300",
                activeSection === section.id ? "bg-primary scale-125" : "bg-muted-foreground/50 group-hover:bg-primary"
              )}
              aria-label={`Go to ${section.key} section`}
            />
            <a href={`#${section.id}`}
               className={cn(
                "text-sm font-medium transition-all duration-300",
                activeSection === section.id ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"
               )}
            >
              {t(section.key)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
