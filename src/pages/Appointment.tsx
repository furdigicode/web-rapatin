
import React from 'react';
import Navbar from '@/components/Navbar';
import SEO from '@/components/SEO';
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
      <SEO
        title="Appointment Booking - Jadwalkan Pertemuan Online Mudah | Rapatin"
        description="Platform appointment booking terpercaya untuk jadwalkan pertemuan bisnis, konsultasi, dan meeting online. Integrasi kalender, reminder otomatis, dan sistem booking yang mudah."
        keywords="appointment booking, jadwal pertemuan online, booking meeting, kalendar online, sistem booking, janji temu online"
        url="https://rapatin.id/appointment"
      />
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
