
import React from 'react';
import GenericStepsSection from '@/components/shared/GenericStepsSection';
import { meetingHowItWorksContent } from '@/content/meetingContent';

const MeetingHowItWorksSection: React.FC = () => {
  return (
    <GenericStepsSection 
      content={meetingHowItWorksContent}
      sectionId="how-it-works"
    />
  );
};

export default MeetingHowItWorksSection;
