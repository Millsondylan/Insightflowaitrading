// Update this page (the content is just a fallback if you fail to update the page)

import Hero from '@/components/ui/Hero';
import FeatureCards from '@/components/ui/FeatureCards';
import CTASection from '@/components/ui/CTASection';
import '@/styles/landing.css';

const IndexPage = () => {
  return (
    <div className="bg-black">
      <Hero />
      <FeatureCards />
      <CTASection />
    </div>
  );
};

export default IndexPage;
