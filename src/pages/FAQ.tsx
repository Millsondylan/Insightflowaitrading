
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "What is InsightFlow AI Trading Platform?",
      answer: "InsightFlow is an AI-powered trading platform that helps traders make better decisions through advanced analytics, strategy building, and real-time market insights."
    },
    {
      question: "How do I get started?",
      answer: "Simply sign up for an account, complete the onboarding process, and start exploring our strategy builder and market analysis tools."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a free tier with basic features. You can upgrade to Pro or Premium plans for advanced features."
    },
    {
      question: "What markets are supported?",
      answer: "We support major cryptocurrency markets, forex, stocks, and commodities through various data providers."
    },
    {
      question: "How does the AI coaching work?",
      answer: "Our AI coach analyzes your trading patterns, provides personalized feedback, and suggests improvements to your strategy and mindset."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 mb-8 text-center">Find answers to common questions about InsightFlow</p>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Card>
            <CardHeader>
              <CardTitle>Still have questions?</CardTitle>
              <CardDescription>Contact our support team for personalized help</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Email us at{' '}
                <a href="mailto:support@insightflow.ai" className="text-blue-600 hover:underline">
                  support@insightflow.ai
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
