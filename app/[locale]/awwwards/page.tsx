import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AwwwardsPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
