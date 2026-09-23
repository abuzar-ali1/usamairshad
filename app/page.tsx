import { Hero } from "@/components/portfolio/hero";
import { SiteHeader } from "@/components/portfolio/site-header";
import { Introduction } from "@/components/portfolio/introduction";
import { WorkSection } from "@/components/portfolio/work-section";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { GallerySection } from "@/components/portfolio/gallery-section";
import { VideoSection } from "@/components/portfolio/video-section";
import { WhyUsSection } from "@/components/portfolio/why-us-section";
import { TeamSection } from "@/components/portfolio/team-section";
import { ClientReviewsSection } from "@/components/portfolio/client-reviews-section";
import { TestimonialsSection } from "@/components/portfolio/testimonials-section";
import { AboutSection } from "@/components/portfolio/about-section";
import { ContactSection } from "@/components/portfolio/contact-section";
import { MotionProvider } from "@/components/portfolio/motion-provider";
import { ScrollNavigation } from "@/components/portfolio/scroll-navigation";
import showcase from "@/components/portfolio/showcase.module.css";

export default function Home() {
  return (
    <MotionProvider>
      <SiteHeader />
      <ScrollNavigation />
      <main id="main-content">
        <Hero />
        <div className={showcase.root}>
          <Introduction />
          <WorkSection />
          <ExperienceSection />
          <GallerySection />
        </div>
        <VideoSection />
        <WhyUsSection />
        <TeamSection />
        <ClientReviewsSection />
        <TestimonialsSection />
        <div className="content-grid">
          <AboutSection />
        </div>
      </main>
      <ContactSection />
    </MotionProvider>
  );
}
