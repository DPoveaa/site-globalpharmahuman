"use client";

import { useEffect, useState } from "react";

interface ElfsightInstagramProps {
  widgetId: string;
}

export function ElfsightInstagram({ widgetId }: ElfsightInstagramProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!widgetId) return;

    const scriptId = "elfsight-platform-script";

    // Load the Elfsight platform script if not already present
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Check if the widget has rendered (Elfsight injects content into the div)
    const container = document.querySelector(`.elfsight-app-${widgetId}`);
    const checkInterval = setInterval(() => {
      if (container && container.children.length > 0) {
        setIsLoading(false);
        clearInterval(checkInterval);
      }
    }, 300);

    // Safety timeout: hide loader after 5 seconds
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
      clearInterval(checkInterval);
    }, 5000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(safetyTimeout);
    };
  }, [widgetId]);

  return (
    <div className="relative w-full min-h-[500px]">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col gap-4 bg-white p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
            <div className="space-y-2">
              <div className="h-3 w-28 animate-pulse rounded-md bg-slate-100" />
              <div className="h-2 w-16 animate-pulse rounded-md bg-slate-100" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="aspect-square w-full animate-pulse rounded-xl bg-slate-100" />
            <div className="aspect-square w-full animate-pulse rounded-xl bg-slate-100" />
            <div className="aspect-square w-full animate-pulse rounded-xl bg-slate-100" />
            <div className="aspect-square w-full animate-pulse rounded-xl bg-slate-100" />
            <div className="aspect-square w-full animate-pulse rounded-xl bg-slate-100" />
            <div className="aspect-square w-full animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
      )}

      {/* Elfsight Widget Container */}
      <div className={`elfsight-app-${widgetId}`} />
    </div>
  );
}
