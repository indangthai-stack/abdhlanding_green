import { loadLandingPageData } from "@/lib/data";
import { Header } from "@/components/Header";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { Hero } from "@/components/sections/Hero";
import { PainPoints } from "@/components/sections/PainPoints";
import { TierSelector } from "@/components/sections/TierSelector";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { HowToOrder } from "@/components/sections/HowToOrder";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { LeadForm } from "@/components/sections/LeadForm";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default async function HomePage() {
  const {
    brands,
    pricingGroups,
    pricingTiers,
    products,
    testimonials,
    faqs,
    siteConfig,
  } = await loadLandingPageData();

  return (
    <>
      <TopBar config={siteConfig} />
      <Header config={siteConfig} />

      <main className="pb-24 md:pb-0">
        <Hero config={siteConfig} featuredProducts={products} />

        <PainPoints />

        <TierSelector groups={pricingGroups} tiers={pricingTiers} />

        <ProductGrid
          products={products}
          brands={brands}
          pricingGroups={pricingGroups}
          pricingTiers={pricingTiers}
          siteConfig={siteConfig}
        />

        <HowToOrder />

        <Testimonials items={testimonials} />

        <FAQ items={faqs} />

        <LeadForm siteConfig={siteConfig} pricingTiers={pricingTiers} />

        <FinalCTA config={siteConfig} />
      </main>

      <Footer config={siteConfig} />
      <StickyMobileBar config={siteConfig} />
    </>
  );
}
