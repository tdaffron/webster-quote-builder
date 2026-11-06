import Image from "next/image";
import { publicPath } from "@/lib/public-path";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-black text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Image
            src={publicPath("/brand/logo-white.png")}
            alt=""
            width={400}
            height={150}
            className="h-12 w-auto"
            style={{ width: "auto" }}
          />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
            Family owned in Orlando since 1962. Third generation, and working on the fourth. Authorized dealer for Bryant, Comfortmaker, and Trane.
          </p>
        </div>
        <div className="text-sm leading-7 text-white/80">
          <p className="font-heading text-base font-bold text-white">Visit or call</p>
          <p>3400 Old Winter Garden Road</p>
          <p>Orlando, FL 32805</p>
          <p>
            <a href="tel:+14072950598" className="text-foam hover:underline">
              (407) 295-0598
            </a>
          </p>
          <p>
            <a href="mailto:info@websterac.com" className="text-foam hover:underline">
              info@websterac.com
            </a>
          </p>
        </div>
        <div className="text-sm leading-6 text-white/80">
          <p>
            Please note that all prices shown are approximate ranges for budgeting purposes only. They are not an official
            estimate or quote. Actual pricing depends on your home&apos;s specific needs and installation requirements. A member
            of Webster AC sales team must visit your property to provide a detailed quote with accurate prices.
          </p>
          <p className="mt-4">License CAC1819524</p>
        </div>
      </div>
    </footer>
  );
}
