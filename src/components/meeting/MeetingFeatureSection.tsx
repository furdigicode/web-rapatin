
import React from 'react';
import GenericFeatureGrid from '@/components/shared/GenericFeatureGrid';
import { meetingFeatureContent } from '@/content/meetingContent';

const MeetingFeatureSection: React.FC = () => {
  return <GenericFeatureGrid content={meetingFeatureContent} />;
};

export default MeetingFeatureSection;
