import { Hero } from "@/components/home/Hero";
import { CompanyLogos } from "@/components/home/CompanyLogos";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CTASection } from "@/components/home/CTASection";
import { FeaturedJobs } from "@/components/home/FeaturedJobs";
import { LatestJobs } from "@/components/home/LatestJobs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <CompanyLogos />
      <CategoryGrid />
      <CTASection />
      <FeaturedJobs />
      <LatestJobs />
    </div>
  );
}
