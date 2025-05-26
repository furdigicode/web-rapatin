
import React from 'react';
import Navbar from '@/components/Navbar';
import AppointmentHero from '@/components/appointment/AppointmentHero';
import AppointmentFeatures from '@/components/appointment/AppointmentFeatures';
import AppointmentHowItWorks from '@/components/appointment/AppointmentHowItWorks';
import AppointmentPricing from '@/components/appointment/AppointmentPricing';
import AppointmentDemo from '@/components/appointment/AppointmentDemo';
import AppointmentTestimonials from '@/components/appointment/AppointmentTestimonials';
import AppointmentCTA from '@/components/appointment/AppointmentCTA';
import Footer from '@/components/Footer';

const Appointment = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AppointmentHero />
      <AppointmentFeatures />
      <AppointmentHowItWorks />
      <AppointmentPricing />
      <AppointmentDemo />
      <AppointmentTestimonials />
      <AppointmentCTA />
      <Footer />
    </div>
  );
};

export default Appointment;
