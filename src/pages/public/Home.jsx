import { Helmet } from 'react-helmet-async';
import Hero from '@/components/sections/Hero';
import TrustStrip from '@/components/sections/TrustStrip';
import ServicesPreview from '@/components/sections/ServicesPreview';
import StatsStrip from '@/components/sections/StatsStrip';
import ProcessSection from '@/components/sections/ProcessSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import TeamSection from '@/components/sections/TeamSection';
import BlogStrip from '@/components/sections/BlogStrip';
import CtaBanner from '@/components/sections/CtaBanner';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>DigiSwarm — Digital Marketing Excellence in Uttarakhand</title>
        <meta
          name="description"
          content="DigiSwarm is your trusted partner for digital marketing in Uttarakhand. Web design, SEO, social media, ads, content, and more."
        />
        <meta property="og:title" content="DigiSwarm — Digital Marketing in Uttarakhand" />
        <meta
          property="og:description"
          content="DigiSwarm is your trusted partner for digital marketing in Uttarakhand. Web design, SEO, social media, ads, content, and more."
        />
        <meta property="og:image" content="/brand-assets/og-social-share-1200x630.png" />
        <meta name="twitter:image" content="/brand-assets/og-social-share-1200x630.png" />
      </Helmet>

      <Hero />
      <TrustStrip />
      <ServicesPreview />
      <StatsStrip />
      <ProcessSection />
      <TestimonialsSection />
      <TeamSection />
      <BlogStrip />
      <CtaBanner />
    </>
  );
}
