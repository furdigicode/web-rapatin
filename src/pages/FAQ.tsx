
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from '@/integrations/supabase/client';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  order_position: number;
};

const FAQ = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const { data, error } = await supabase
          .from('faq_items')
          .select('*')
          .eq('active', true)
          .order('order_position', { ascending: true }) as { data: FAQItem[] | null; error: Error | null };

        if (error) {
          console.error('Error fetching FAQs:', error);
        } else if (data) {
          setFaqItems(data);
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error('Error in FAQ fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">Pertanyaan yang Sering Diajukan</h1>
            <p className="text-xl text-muted-foreground mt-4">
              Jawaban atas pertanyaan umum tentang Rapatin
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <p>Loading FAQs...</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {categories.map((category) => (
                <div key={category} className="mb-10">
                  <h2 className="text-2xl font-semibold capitalize mb-4">{category}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {faqItems
                      .filter(item => item.category === category)
                      .map((item) => (
                        <AccordionItem key={item.id} value={item.id}>
                          <AccordionTrigger className="text-left">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="prose prose-slate max-w-none">
                              <p>{item.answer}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
