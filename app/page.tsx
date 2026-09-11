import { Hero } from "@/components/portfolio/hero";
import { SiteHeader } from "@/components/portfolio/site-header";
import { Introduction } from "@/components/portfolio/introduction";
import { WorkSection } from "@/components/portfolio/work-section";
import { ExperienceSection } from "@/components/portfolio/experience-section";
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
        </div>
        <div className="content-grid">
          <AboutSection />
        </div>
      </main>
      <ContactSection />
    </MotionProvider>
  );
}
