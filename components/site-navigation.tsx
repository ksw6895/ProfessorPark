"use client";

import { useEffect, useState } from "react";

const navigationSections = [
  { id: "overview", label: "Overview" },
  { id: "physics", label: "Q1 · Physics" },
  { id: "clinical", label: "Q1 · Clinical" },
  { id: "simulator", label: "Q2 · Simulator" },
  { id: "comparison", label: "Q2 · Comparison" },
  { id: "datasets", label: "Q2 · Datasets" },
  { id: "cheatsheet", label: "Q2 · Cheatsheet" },
  { id: "valves", label: "Q3 · Valves" },
  { id: "conclusion", label: "Conclusion" },
] as const;

type SectionId = (typeof navigationSections)[number]["id"];

export function SiteNavigation() {
  const [activeSection, setActiveSection] = useState<SectionId>(navigationSections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .forEach((entry) => {
            const id = entry.target.id as SectionId;
            if (navigationSections.some((section) => section.id === id)) {
              setActiveSection(id);
            }
          });
      },
      {
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    const elements = navigationSections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => Boolean(el));

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-slate-50/90 backdrop-blur">
      <div className="section-wrapper flex items-center gap-3 overflow-x-auto py-4">
        {navigationSections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isActive ? "bg-primary text-white shadow" : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {section.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
