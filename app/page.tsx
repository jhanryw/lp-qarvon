import { Hero } from "@/components/sections/Hero";
import { ProofBar } from "@/components/sections/ProofBar";
import { VSLSection } from "@/components/sections/VSLSection";
import { PainSection } from "@/components/sections/PainSection";
import { MethodSection } from "@/components/sections/MethodSection";
import { CaseSection } from "@/components/sections/CaseSection";
import { LeversSection } from "@/components/sections/LeversSection";
import { FitSection } from "@/components/sections/FitSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { Footer } from "@/components/sections/Footer";
import { StickyMobileCta } from "@/components/sections/StickyMobileCta";

export default function Home() {
  return (
    <>
      <main className="flex-1 pb-16 sm:pb-0">
        <Hero />
        <ProofBar />
        <VSLSection />
        <PainSection />
        <MethodSection />
        <CaseSection />
        <LeversSection />
        <FitSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
      <StickyMobileCta />
    </>
  );
}
