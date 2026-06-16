import { Helmet } from 'react-helmet-async';
import HeroSection from '../../components/sections/HeroSection';
import WhyUsSection from '../../components/sections/WhyUsSection';
import ProgramSection from '../../components/sections/ProgramSection';
import TimelineSection from '../../components/sections/TimelineSection';
import GallerySection from '../../components/sections/GallerySection';
import CostSection from '../../components/sections/CostSection';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Markaz IT Madinah - Study Center | Belajar Ilmu Syariah & Teknologi di Kota Nabi ﷺ</title>
        <meta
          name="description"
          content="Program studi intensif yang memadukan ilmu syar'i, tahfidz Al-Quran, dan teknologi informasi di Madinah Al-Munawwarah. Daftar sekarang!"
        />
      </Helmet>
      <HeroSection />
      <WhyUsSection />
      <ProgramSection />
      <TimelineSection />
      <GallerySection />
      <CostSection />
    </>
  );
}
