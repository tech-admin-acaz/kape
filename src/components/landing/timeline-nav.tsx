"use client"

import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

const sections = ['hero', 'features'];

export function TimelineNav() {
  const [activeSection, setActiveSection] = useState('hero');

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

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);
  
  return (
    <nav className="fixed right-4 top-1/2 z-50 -translate-y-1/2 transform">
      <ul className="space-y-4">
        {sections.map((section) => (
          <li key={section}>
            <a
              href={`#${section}`}
              className={cn(
                "block h-3 w-3 rounded-full transition-all duration-300",
                activeSection === section ? "bg-primary scale-125" : "bg-muted-foreground/50 hover:bg-primary"
              )}
              aria-label={`Go to ${section} section`}
            ></a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
