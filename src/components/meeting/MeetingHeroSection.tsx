
import React from 'react';
import GenericHeroSection from '@/components/shared/GenericHeroSection';
import { meetingHeroContent } from '@/content/meetingContent';

const MeetingHeroSection: React.FC = () => {
  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
  };

  return (
    <GenericHeroSection 
      content={meetingHeroContent}
      onPrimaryCTA={handleRegistration}
      showBrands={true}
    />
  );
};

export default MeetingHeroSection;
