import { Hero } from "@/components/home/hero";
import { StatStrip } from "@/components/home/stat-strip";
import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { FinalCta } from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatStrip />
      <HowItWorks />
      <Features />
      <FinalCta />
    </>
  );
}
