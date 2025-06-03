
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const CourseFAQ = () => {
  const faqs = [
    {
      id: 'faq-1',
      question: 'Who are Career Accelerators for?',
      answer: 'Career Accelerators are designed for anyone looking to advance their career in web development, whether you are a complete beginner or looking to upskill in modern technologies.'
    },
    {
      id: 'faq-2',
      question: 'Is any prior knowledge or experience required?',
      answer: 'No prior experience is required. Our courses are designed to take you from zero to hero, starting with the fundamentals and progressing to advanced topics.'
    },
    {
      id: 'faq-3',
      question: 'How are courses selected for career accelerators?',
      answer: 'Courses are carefully curated by industry experts based on current market demands, employer requirements, and the latest technology trends.'
    },
    {
      id: 'faq-4',
      question: 'What is a full-stack web developer?',
      answer: 'A full-stack web developer is someone who can work on both the frontend (client-side) and backend (server-side) portions of web applications, including databases, servers, and user interfaces.'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
        
        <Accordion type="single" collapsible>
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="text-center mt-8">
          <Button variant="outline">Show 3 more</Button>
        </div>
      </div>
    </section>
  );
};

export default CourseFAQ;
