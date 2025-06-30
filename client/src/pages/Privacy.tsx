import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
      
      <Card className="bg-black/30 border-white/10 backdrop-blur-md text-white mb-8">
        <CardContent className="pt-6 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">1. Introduction</h2>
            <p className="text-gray-300">
              At InsightFlow AI Trading ("we," "our," or "us"), we respect your privacy and are committed 
              to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website or use our services.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">2. Information We Collect</h2>
            <p className="text-gray-300 mb-4">
              We may collect several types of information from and about users of our services, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                <strong>Personal Information:</strong> Name, email address, telephone number, and payment information.
              </li>
              <li>
                <strong>Account Information:</strong> Login credentials and preferences.
              </li>
              <li>
                <strong>Trading Data:</strong> Your trading strategies, historical trades, and performance metrics.
              </li>
              <li>
                <strong>Usage Information:</strong> How you interact with our platform, features you use, and time spent.
              </li>
              <li>
                <strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.
              </li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Communicate with you about products, services, offers, and events</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Personalize and improve the user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-300">
              We may share your personal information in certain limited circumstances, including with your consent, 
              to comply with laws, to respond to lawful requests and legal process, to protect rights and safety, 
              and in connection with a merger or acquisition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">5. Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate technical and organizational security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">6. Third-Party Services</h2>
            <p className="text-gray-300">
              Our service may contain links to third-party websites or services. We are not responsible for 
              the privacy practices of these third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">7. Your Privacy Rights</h2>
            <p className="text-gray-300 mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>The right to access your personal data</li>
              <li>The right to rectify inaccurate personal data</li>
              <li>The right to erase your personal data</li>
              <li>The right to restrict processing</li>
              <li>The right to data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">8. Children's Privacy</h2>
            <p className="text-gray-300">
              Our services are not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">9. Changes to this Privacy Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">10. Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-300 mt-2">
              Email: privacy@insightflowai.com
            </p>
          </section>
          
          <section>
            <p className="text-gray-400 text-sm">
              Last updated: June 28, 2025
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

export const lovable = { 
  component: PrivacyPage 
};