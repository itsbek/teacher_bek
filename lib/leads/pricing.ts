// Server-only: pricing strings must never be imported by client components or
// next-intl messages, so they are only revealed by /api/pricing-lead on success.
export type PricingLocale = 'en' | 'vi' | 'zh' | 'ru';
export type PricingProgramId = 'youngLearners' | 'teens';

export interface PricingPayload {
  programs: { id: PricingProgramId; price: string }[];
  introOffer: string;
}

const PRICING: Record<PricingLocale, { price: string; introOffer: string }> = {
  en: {
    price: '2,990,000 VND / month',
    introOffer: 'First month 1,990,000 VND (save 1,000,000) after your free week',
  },
  vi: {
    price: '2.990.000đ/tháng',
    introOffer: 'Tháng đầu 1.990.000đ (giảm 1.000.000đ) sau tuần học thử miễn phí',
  },
  zh: {
    price: '2,990,000 越南盾/月',
    introOffer: '首月优惠价 1,990,000 越南盾（省 1,000,000），免费试学一周后生效',
  },
  ru: {
    price: '2 990 000 VND / месяц',
    introOffer: 'Первый месяц 1 990 000 VND (экономия 1 000 000) после бесплатной пробной недели',
  },
};

export function getPricing(locale: string | undefined): PricingPayload {
  const key: PricingLocale = locale === 'vi' || locale === 'zh' || locale === 'ru' ? locale : 'en';
  const p = PRICING[key];
  return {
    programs: [
      { id: 'youngLearners', price: p.price },
      { id: 'teens', price: p.price },
    ],
    introOffer: p.introOffer,
  };
}
