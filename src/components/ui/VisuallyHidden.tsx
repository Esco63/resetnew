// src/components/ui/VisuallyHidden.tsx
import * as React from "react";

export default function VisuallyHidden(
  props: React.HTMLAttributes<HTMLSpanElement>
) {
  return (
    <span
      {...props}
      className="sr-only"
    />
  );
}
