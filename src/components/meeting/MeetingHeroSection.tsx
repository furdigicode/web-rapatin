
import React, { useState } from 'react';
import GenericHeroSection from '@/components/shared/GenericHeroSection';
import { meetingHeroContent } from '@/content/meetingContent';
import FreeTrialModal from '@/components/ui/free-trial-modal';
import { shouldShowModal, getRedirectUrl } from '@/hooks/useURLParams';

const MeetingHeroSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
    
    if (shouldShowModal()) {
      setModalOpen(true);
    } else {
      const redirectUrl = getRedirectUrl();
      window.open(redirectUrl, '_blank');
    }
  };

  return (
    <>
      <GenericHeroSection 
        content={meetingHeroContent}
        onPrimaryCTA={handleRegistration}
        showBrands={true}
      />
      
      {shouldShowModal() && (
        <FreeTrialModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default MeetingHeroSection;
