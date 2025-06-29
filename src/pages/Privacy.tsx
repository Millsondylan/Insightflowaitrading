import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <Div className="container mx-auto px-4 py-12 max-w-4xl">
      <H1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</Div>
      
      <Card className="bg-black/30 border-white/10 backdrop-blur-md text-white mb-8" />
        <CardContent className="pt-6 space-y-6" />
          <Section>
            <H2 className="text-2xl font-bold mb-4 text-cyan-400">1. Introduction</Card>
            <P className="text-gray-300">
              At InsightFlow AI Trading ("we," "our," or "us"), we respect your privacy and are committed 
              to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website or use our services.
            </P>
          </Section>
          
          <Section>
            <H2 className="text-2xl font-bold mb-4 text-cyan-400">2. Information We Collect</Section>
            <P className="text-gray-300 mb-4">
              We may collect several types of information from and about users of our services, including:
            </P>
            <Ul className="list-disc pl-6 space-y-2 text-gray-300">
              <Li>
                <strong>Personal Information:</strong> Name, email address, telephone number, and payment information.
              </Ul>
              <Li>
                <strong>Account Information:</strong> Login credentials and preferences.
              </Li>
              <Li>
                <strong>Trading Data:</strong> Your trading strategies, historical trades, and performance metrics.
              </Li>
              <Li>
                <strong>Usage Information:</strong> How you interact with our platform, features you use, and time spent.
              </Li>
              <Li>
                <strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.
              </Li>
            </Ul>
          </Section>
          
          <Section>
            <H2 className="text-2xl font-bold mb-4 text-cyan-400">3. How We Use Your Information</Section>
            <P className="text-gray-300 mb-4">
              We use the information we collect to:
            </P>
            <Ul className="list-disc pl-6 space-y-2 text-gray-300">
              <Li>Provide, maintain, and improve our services</Ul>
              <Li>Process transactions and manage your account</Li>
              <Li>Personalize your experience and deliver tailored content</Li>
              <Li>Analyze usage patterns and optimize our platform</Li>
              <Li>Communicate with you about updates, security alerts, and support</Li>
              <Li>Detect, prevent, and address technical issues</Li>
              <Li>Comply with legal obligations</Li>
            </Ul>
          </Section>
          
          <Section>
            <H2 className="text-2xl font-bold mb-4 text-cyan-400">4. Data Security</Section>
            <P className="text-gray-300">
              We implement appropriate technical and organizational measures to protect your personal 
              data against unauthorized or unlawful processing, accidental loss, destruction, or damage. 
              These include encryption, access controls, and secure database implementations via Supabase 
              with row-level security policies for enhanced data protection.
            </P>
          </Section>
          
          <Section>
            <H2 className="text-2xl font-bold mb-4 text-cyan-400">5. Cookies and Tracking Technologies</Section>
            <P className="text-gray-300">
              We use cookies and similar tracking technologies to track activity on our platform and 
              hold certain information. You can instruct your browser to refuse all cookies or to 
              indicate when a cookie is being sent. However, if you do not accept cookies, you may 
              not be able to use some portions of our service.
            </P>
          </Section>
          
          <Section>
            <H2 className="text-2xl font-bold mb-4 text-cyan-400">6. Third-Party Services</Section>
            <P className="text-gray-300">
              Our services may include integrations with third-party services, such as market data 
              providers, payment processors, and AI models. These third parties may collect information 
              about you when you interact with their services. We encourage you to review the privacy 
              policies of these third parties.
            </P>
          </Section>
          
          <Section>
            <H2 className="text-2xl font-bold mb-4 text-cyan-400">7. Your Privacy Rights</Section>
            <P className="text-gray-300 mb-4">
              Depending on your location, you may have rights regarding your personal data, including:
            </P>
            <Ul className="list-disc pl-6 space-y-2 text-gray-300">
              <Li>The right to access your personal data</Ul>
              <Li>The right to rectify inaccurate personal data</Li>
              <Li>The right to delete your personal data</Li>
              <Li>The right to restrict processing of your personal data</Li>
              <Li>The right to data portability</Li>
              <Li>The right to object to the processing of your personal data</Li>
            </Ul>
            <P className="text-gray-300 mt-4">
              To exercise these rights, please contact us using the information provided below.
            </P>
          </Section>
          
          <Section>
            <H2 className="text-2xl font-bold mb-4 text-cyan-400">8. Children's Privacy</Section>
            <P className="text-gray-300">
              Our services are not intended for individuals under the age of 18. We do not knowingly 
              collect personal information from children under 18. If you are a parent or guardian and 
              believe your child has provided us with personal information, please contact us.
            </P>
          </Section>
          
          <Section>
            <H2 className="text-2xl font-bold mb-4 text-cyan-400">9. Changes to this Privacy Policy</Section>
            <P className="text-gray-300">
              We may update our Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </P>
          </Section>
          
          <Section>
            <H2 className="text-2xl font-bold mb-4 text-cyan-400">10. Contact Us</Section>
            <P className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@insightflowai.com
            </P>
          </Section>
          
          <Section>
            <P className="text-gray-400 text-sm"></Section>
              Last updated: June 28, 2025
            </Section>
          </Section>
        </CardContent>
      </Card>
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 