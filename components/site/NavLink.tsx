"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/** A header link that marks itself as the current page. */
export function NavLink({ href, className, children }: NavLinkProps) {
  const pathname = usePathname();
  const current = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link href={href} className={className} aria-current={current ? "page" : undefined}>
      {children}
    </Link>
  );
}
