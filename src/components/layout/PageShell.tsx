import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps every page. Route changes animate through CSS view transitions: the old page
 * sinks away and the new one rises through an arch (see ::view-transition-*(.page)).
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <main id="main" className="relative">
        {children}
      </main>
    </ViewTransition>
  );
}
