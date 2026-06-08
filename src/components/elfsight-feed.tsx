"use client";

import { useEffect, useState } from "react";

interface ElfsightFeedProps {
  widgetId: string;
}

export function ElfsightFeed({ widgetId }: ElfsightFeedProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!widgetId) return;

    const scriptId = "elfsight-platform-script";
    
    // Load script if not already present
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.dataset.useServiceCore = "true";
      script.defer = true;
      document.body.appendChild(script);
    }

    // Since Elfsight renders dynamically, we set a safety timeout to hide the skeleton
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timeout);
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

      {/* Elfsight Container */}
      <div className="w-full h-full overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className={`elfsight-app-${widgetId}`} data-elfsight-app-lazy></div>
      </div>
    </div>
  );
}
