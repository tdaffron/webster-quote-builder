import Image from "next/image";
import type { ReactNode } from "react";
import { publicPath } from "@/lib/public-path";

export function SiteHeader({ price }: { price: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
      <div className="h-1 bg-gradient-to-r from-cyan to-mint" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#estimate" className="shrink-0">
          <Image
            src={publicPath("/brand/logo.png")}
            alt="Webster Air Conditioning & Heating"
            width={400}
            height={150}
            priority
            className="h-11 w-auto sm:h-12"
            style={{ width: "auto" }}
          />
        </a>
        <div className="text-right">
          <p className="hidden text-xs font-medium tracking-[0.14em] text-steel uppercase sm:block">Orlando · Since 1962</p>
          <a href="tel:+14072950598" className="font-heading text-base font-bold text-cyan-deep sm:text-lg">
            (407) 295-0598
          </a>
        </div>
      </div>
      {price}
    </header>
  );
}
