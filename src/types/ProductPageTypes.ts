
export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA: {
    text: string;
    href: string;
  };
  highlights: Array<{
    icon: string;
    text: string;
  }>;
  image: {
    src: string;
    alt: string;
  };
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  delay: string;
}

export interface StepItem {
  number: number;
  icon: string;
  title: string;
  description: string;
}

export interface UseCase {
  icon: string;
  title: string;
}

export interface FeatureContent {
  badge: string;
  title: string;
  subtitle: string;
  features: FeatureItem[];
  useCases: {
    title: string;
    items: UseCase[];
  };
}

export interface HowItWorksContent {
  badge: string;
  title: string;
  subtitle: string;
  steps: StepItem[];
}
