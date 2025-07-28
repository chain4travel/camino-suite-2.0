// apps/camino-suite/src/app/partners/layout.tsx
import React from 'react';

// Make sure you're using the correct export pattern
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Your layout content */}
      {children}
    </div>
  );
}

// Remove any other exports like 'layout' function
// export const layout = ... // Remove this if it exists
