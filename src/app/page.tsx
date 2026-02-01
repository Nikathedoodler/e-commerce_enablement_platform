import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import Pricing from "@/components/Pricing";
import PlatformShowcase from "@/components/PlatformShowcase";
import KeyMetrics from "@/components/KeyMetrics";
import BenefitsSection from "@/components/BenefitsSection";
import UseCases from "@/components/UseCases";
import ComparisonSection from "@/components/ComparisonSection";
import TrustIndicators from "@/components/TrustIndicators";

export default function Home() {
  return (
    <div>
      <Navigation />
      <Hero />
      {/* Platform Showcase - Dashboard & Analytics Features */}
      <PlatformShowcase />
      {/* Key Metrics - Impressive Numbers */}
      <KeyMetrics />
      {/* Benefits - Why Choose Us */}
      <BenefitsSection />
      {/* Use Cases - Who It's For */}
      <UseCases />
      {/* Comparison - vs Competitors */}
      <ComparisonSection />
      {/* Trust Indicators - Security & Compliance */}
      <TrustIndicators />
      {/* Features - Available Features */}
      <Features />
      {/* Pricing */}
      <Pricing />
      <Footer />
    </div>
  );
}
