// app/components/seo/JsonLd.tsx
"use client";

import Script from "next/script";

type JsonLdProps = {
  id?: string;
  data: Record<string, unknown>;
};

export default function JsonLd({ id = "json-ld", data }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
