"use client";

import { useEffect, useState } from "react";

interface CuratorFeedProps {
  feedId: string;
}

export function CuratorFeed({ feedId }: CuratorFeedProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!feedId) return;

    const container = document.getElementById("curator-feed-default-feed-layout");
    const scriptId = `curator-script-${feedId}`;
    
    // Load script if not already present
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://cdn.curator.io/published/${feedId}.js`;
      script.async = true;
      script.charset = "UTF-8";
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    // Check if curator has loaded elements (usually curator appends styled divs)
    const checkInterval = setInterval(() => {
      if (container && container.children.length > 1) {
        setIsLoading(false);
        clearInterval(checkInterval);
      }
    }, 300);

    // Safety timeout: Hide loader after 4 seconds (e.g. adblocker, slow network)
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
      clearInterval(checkInterval);
    }, 4000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(safetyTimeout);
    };
  }, [feedId]);

  return (
    <div className="relative w-full min-h-[500px]">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col gap-4 bg-white p-4">
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

      {/* Curator Feed Container */}
      <div 
        id="curator-feed-default-feed-layout" 
        className="w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm p-1"
      >
        <a 
          href="https://curator.io" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="crt-logo crt-tag hidden"
        >
          Powered by Curator.io
        </a>
      </div>
    </div>
  );
}
