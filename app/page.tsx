import { FormModalProvider } from "@/components/form/FormModalContext";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { IdentificationSection } from "@/components/sections/IdentificationSection";
import { ReframeSection } from "@/components/sections/ReframeSection";
import { CaseTeaserSection } from "@/components/sections/CaseTeaserSection";
import { DiscoverySection } from "@/components/sections/DiscoverySection";
import { MethodSection } from "@/components/sections/MethodSection";
import { WhatWeDoSection } from "@/components/sections/WhatWeDoSection";
import { CaseSection } from "@/components/sections/CaseSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FitSection } from "@/components/sections/FitSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { Footer } from "@/components/sections/Footer";
import { StickyMobileCta } from "@/components/sections/StickyMobileCta";

export default function Home() {
  return (
    <FormModalProvider>
      <main className="flex-1 pb-16 sm:pb-0">
        <Hero />
        <ProblemSection />
        <IdentificationSection />
        <ReframeSection />
        <CaseTeaserSection />
        <DiscoverySection />
        <MethodSection />
        <WhatWeDoSection />
        <CaseSection />
        <TestimonialsSection />
        <FitSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
      <StickyMobileCta />
    </FormModalProvider>
  );
}
