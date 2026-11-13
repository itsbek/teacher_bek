import { OG_CONTENT_TYPE, OG_SIZE, renderHomeOg } from "@/lib/og/image";

export const alt = "Teacher Bek";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderHomeOg(locale);
}
