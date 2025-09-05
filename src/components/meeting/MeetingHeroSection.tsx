
import React, { useState } from 'react';
import GenericHeroSection from '@/components/shared/GenericHeroSection';
import { meetingHeroContent } from '@/content/meetingContent';
import FreeTrialModal from '@/components/ui/free-trial-modal';
import { hasTrialParams } from '@/hooks/useURLParams';

const MeetingHeroSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
    
    if (!hasTrialParams()) {
      window.open('https://app.rapatin.id/dashboard/register', '_blank');
      return;
    }
    
    setModalOpen(true);
  };

  return (
    <>
      <GenericHeroSection 
        content={meetingHeroContent}
        onPrimaryCTA={handleRegistration}
        showBrands={true}
      />
      
      {hasTrialParams() && (
        <FreeTrialModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default MeetingHeroSection;
