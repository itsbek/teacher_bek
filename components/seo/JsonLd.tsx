interface JsonLdProps {
  /** one schema.org node, or several nodes emitted as a single @graph */
  data: Record<string, unknown> | Record<string, unknown>[];
}

/** Server-rendered JSON-LD. `<` is escaped so page text can never close the script tag. */
export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : { "@context": "https://schema.org", ...data };
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
