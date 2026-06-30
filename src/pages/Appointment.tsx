
import React, { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import AppointmentHero from '@/components/appointment/AppointmentHero';
import { LazySection } from '@/components/LazySection';

// Lazy load below-the-fold components
const AppointmentFeatures = lazy(() => import('@/components/appointment/AppointmentFeatures'));
const AppointmentHowItWorks = lazy(() => import('@/components/appointment/AppointmentHowItWorks'));
const AppointmentPricing = lazy(() => import('@/components/appointment/AppointmentPricing'));
const AppointmentDemo = lazy(() => import('@/components/appointment/AppointmentDemo'));
const AppointmentTestimonials = lazy(() => import('@/components/appointment/AppointmentTestimonials'));
const AppointmentCTA = lazy(() => import('@/components/appointment/AppointmentCTA'));
const Footer = lazy(() => import('@/components/Footer'));

const Appointment = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AppointmentHero />
      
      <LazySection fallbackHeight="600px">
        <Suspense fallback={<div className="h-[600px] animate-pulse bg-muted/10" />}>
          <AppointmentFeatures />
        </Suspense>
      </LazySection>
      
      <LazySection fallbackHeight="500px">
        <Suspense fallback={<div className="h-[500px] animate-pulse bg-muted/10" />}>
          <AppointmentHowItWorks />
        </Suspense>
      </LazySection>
      
      <LazySection fallbackHeight="700px">
        <Suspense fallback={<div className="h-[700px] animate-pulse bg-muted/10" />}>
          <AppointmentPricing />
        </Suspense>
      </LazySection>
      
      <LazySection fallbackHeight="500px">
        <Suspense fallback={<div className="h-[500px] animate-pulse bg-muted/10" />}>
          <AppointmentDemo />
        </Suspense>
      </LazySection>
      
      <LazySection fallbackHeight="600px">
        <Suspense fallback={<div className="h-[600px] animate-pulse bg-muted/10" />}>
          <AppointmentTestimonials />
        </Suspense>
      </LazySection>
      
      <LazySection fallbackHeight="400px">
        <Suspense fallback={<div className="h-[400px] animate-pulse bg-muted/10" />}>
          <AppointmentCTA />
        </Suspense>
      </LazySection>
      
      <LazySection fallbackHeight="300px">
        <Suspense fallback={<div className="h-[300px] animate-pulse bg-muted/10" />}>
          <Footer />
        </Suspense>
      </LazySection>
    </div>
  );
};

export default Appointment;
