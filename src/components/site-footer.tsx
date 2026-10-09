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
            Family owned in Orlando since 1962. Third generation, and working on the fourth. Authorized dealer for Comfortmaker and Trane.
          </p>
        </div>
        <div className="text-sm leading-7 text-white/80">
          <p className="font-heading text-base font-bold text-white">Visit or call</p>
          <p>6828 W Livingston St</p>
          <p>Orlando, FL 32835</p>
          <p>
            <a href="tel:+14072950598" className="text-cyan hover:underline">
              (407) 295-0598
            </a>
          </p>
          <p>
            <a href="mailto:info@websterac.com" className="text-cyan hover:underline">
              info@websterac.com
            </a>
          </p>
        </div>
        <div className="text-sm leading-7 text-white/80">
          <p className="font-heading text-base font-bold text-white">This demo</p>
          <p>Prices are placeholders. Swap the book in the pricing file when Webster’s numbers are ready.</p>
          <p>License CAC1819524</p>
          <p>Photo reading on the data-plate step is simulated.</p>
        </div>
      </div>
    </footer>
  );
}
