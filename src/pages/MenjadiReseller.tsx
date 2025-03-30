
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Shield,
  BarChart as ChartBar,
  Percent as BadgePercent,
  Users,
  Headphones,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MenjadiReseller = () => {
  // Track registration click with Facebook Pixel
  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', { content_name: 'reseller_program' });
    }
  };

  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Flexible Pricing Control",
      description: "Set your own selling price & profit margin."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Zero Monthly Commitment",
      description: "No subscription, no upfront fee — Pay-As-You-Go."
    },
    {
      icon: <ChartBar className="h-6 w-6" />,
      title: "Real-Time Dashboard Access",
      description: "Manage balance, sales, and customers easily via dashboard."
    },
    {
      icon: <BadgePercent className="h-6 w-6" />,
      title: "Attractive Commissions",
      description: "Get a competitive commission from every meeting credit sold."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "High Demand Market",
      description: "Ideal for businesses, freelancers, communities needing flexible meeting solutions."
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Dedicated Reseller Support",
      description: "Priority access to Rapatin's support team to help your reseller business."
    }
  ];

  const howItWorksSteps = [
    {
      number: 1,
      title: "Register as Rapatin Reseller",
      description: "Create your reseller account in minutes."
    },
    {
      number: 2,
      title: "Top-up your reseller balance",
      description: "Add credit to your reseller account to start selling."
    },
    {
      number: 3,
      title: "Sell meeting credits to your customers",
      description: "Offer flexible meeting solutions with your own pricing."
    },
    {
      number: 4,
      title: "Track sales & commission in dashboard",
      description: "Monitor your earnings and customer activity in real-time."
    }
  ];

  const faqs = [
    {
      question: "How much commission will I get?",
      answer: "As a Rapatin reseller, you'll earn a competitive commission rate that depends on your sales volume. The more you sell, the higher your commission percentage can grow. Contact our team for specific commission rates based on your business needs."
    },
    {
      question: "How to top-up reseller balance?",
      answer: "You can top-up your reseller balance through various payment methods including bank transfer, e-wallet, and credit/debit card. Simply log in to your reseller dashboard, select the top-up option, choose your preferred payment method, and follow the instructions."
    },
    {
      question: "Is there a minimum top-up amount?",
      answer: "Yes, there is a minimum top-up amount to ensure you have sufficient credit to resell. The current minimum top-up amount can be found in your reseller dashboard. This requirement helps maintain efficiency in the reselling process."
    },
    {
      question: "Can I set my own selling price?",
      answer: "Absolutely! As a Rapatin reseller, you have complete freedom to set your own selling prices. This flexibility allows you to determine your profit margins and implement pricing strategies that work best for your target market."
    },
    {
      question: "How do I manage sales & customers?",
      answer: "You can manage all your sales and customers through your dedicated reseller dashboard. The dashboard provides real-time data on sales, customer activity, balance, commission earnings, and more, making it easy to track and grow your reseller business."
    },
    {
      question: "What kind of support will I get?",
      answer: "As a Rapatin reseller, you'll receive priority support from our dedicated team. This includes technical assistance, marketing materials, sales guidance, and regular updates about new features and promotions. We're committed to helping you succeed in your reseller business."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 bg-gradient-to-b from-background to-accent/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 animate-fade-in">
              <div className="inline-flex items-center py-1 px-4 bg-primary/10 rounded-full mb-4">
                <span className="text-xs font-medium text-primary">Program Reseller</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Earn More with Rapatin Reseller Program
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Resell Pay-As-You-Go online meeting credits for Zoom, Google Meet, Microsoft Teams — without monthly fees or subscriptions.
              </p>
              <Button asChild size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white">
                <a href="https://app.rapatin.id/register" onClick={handleRegistration} target="_blank" rel="noopener noreferrer">
                  Join Reseller Program Now
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </Button>
            </div>
            <div className="flex-1 animate-float">
              <img 
                src="/lovable-uploads/edbf847f-3513-412d-954a-41d6319fbaf2.png" 
                alt="Rapatin Reseller Program" 
                className="rounded-2xl shadow-elevation" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Become a Reseller */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Why Become a Reseller?</h2>
            <p className="text-lg text-muted-foreground">
              Online meetings are now essential for businesses, communities, and events. Rapatin provides a flexible, top-up based meeting platform. As a reseller, you can offer meeting credits to customers who need spontaneous, flexible, and affordable meeting solutions.
            </p>
          </div>
        </div>
      </section>

      {/* 6 Key Benefits */}
      <section className="py-16 bg-gradient-to-b from-white to-accent/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center py-1 px-4 bg-primary/10 rounded-full mb-4">
              <span className="text-xs font-medium text-primary">Benefits</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">6 Key Benefits of Becoming a Rapatin Reseller</h2>
            <p className="text-muted-foreground">Join our growing network of resellers and enjoy these advantages</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="glass hover:shadow-elevation transition-all duration-300 animate-fade-in">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center py-1 px-4 bg-primary/10 rounded-full mb-4">
              <span className="text-xs font-medium text-primary">Process</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Get started with these simple steps</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="flex gap-4 items-start animate-fade-in delay-100">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-bold">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white">
                <a href="https://app.rapatin.id/register" onClick={handleRegistration} target="_blank" rel="noopener noreferrer">
                  Start Your Reseller Journey
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-white to-accent/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center py-1 px-4 bg-primary/10 rounded-full mb-4">
              <span className="text-xs font-medium text-primary">Questions</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Find answers to common questions about our reseller program</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-accent/20 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto glass rounded-2xl p-8 md:p-12 shadow-elevation border border-white/40 animate-scale-in">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Become a Rapatin Reseller Today and Start Earning!</h2>
                <p className="text-muted-foreground mb-6">
                  Join our network of successful resellers and start offering flexible meeting solutions to your customers.
                </p>
                <Button asChild size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white">
                  <a href="https://app.rapatin.id/register" onClick={handleRegistration} target="_blank" rel="noopener noreferrer">
                    Register as Reseller
                    <ArrowRight size={16} className="ml-2" />
                  </a>
                </Button>
              </div>
              <div className="rounded-xl bg-primary/5 p-6 space-y-4">
                <h3 className="font-medium text-lg">What you'll get:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">Your own branded meeting solution</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">Complete control over pricing and margins</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">Comprehensive reseller dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">Marketing materials and sales support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">Priority technical support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default MenjadiReseller;
