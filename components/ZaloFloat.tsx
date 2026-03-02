"use client";

export function ZaloFloat() {
  return (
    <a
      href="https://zalo.me/84353885757"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message on Zalo"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 overflow-hidden rounded-[26px] shadow-[0_4px_20px_rgba(0,104,255,0.5)] hover:shadow-[0_6px_28px_rgba(0,104,255,0.7)] hover:scale-110 active:scale-95 transition-all duration-300"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/icons/zalo.svg" width={56} height={56} alt="" aria-hidden="true" className="block" />
    </a>
  );
}
