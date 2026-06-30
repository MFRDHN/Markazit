import HeroSection from '../../components/sections/HeroSection';
import WhyUsSection from '../../components/sections/WhyUsSection';
import ProgramSection from '../../components/sections/ProgramSection';
import TimelineSection from '../../components/sections/TimelineSection';
import GallerySection from '../../components/sections/GallerySection';
import CostSection from '../../components/sections/CostSection';
import SEOHelmet from '../../components/common/SEOHelmet';
import { SmoothReveal, ParallaxFade, ScaleOnScroll, BlurReveal } from '../../components/common/SmoothReveal';

export default function Home() {
  return (
    <>
      <SEOHelmet
        title="pageTitle.home"
        description="Program studi intensif yang memadukan ilmu syar'i, tahfidz Al-Quran, dan teknologi informasi di Madinah Al-Munawwarah. Daftar sekarang!"
        canonicalPath="/"
      />
      <HeroSection />
      <SmoothReveal>
        <WhyUsSection />
      </SmoothReveal>
      <ParallaxFade speed={0.2}>
        <ProgramSection />
      </ParallaxFade>
      <ScaleOnScroll>
        <TimelineSection />
      </ScaleOnScroll>
      <BlurReveal>
        <GallerySection />
      </BlurReveal>
      <SmoothReveal>
        <CostSection />
      </SmoothReveal>
    </>
  );
}
