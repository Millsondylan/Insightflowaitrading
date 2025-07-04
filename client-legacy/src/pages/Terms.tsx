import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-white">Terms of Service</h1>
      <Card className="bg-black/30 border-white/10 backdrop-blur-md text-white mb-8">
        <CardContent className="pt-6 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">1. Introduction</h2>
            <p className="text-gray-300">
              Welcome to InsightFlow AI Trading ("we," "our," or "us"). By accessing or using our website, 
              services, or applications (collectively, the "Services"), you agree to be bound by these Terms 
              of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Services.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">2. Eligibility</h2>
            <p className="text-gray-300">
              You must be at least 18 years old to access or use our Services. By accessing or using our 
              Services, you represent and warrant that you are at least 18 years old and have the legal 
              capacity to enter into these Terms.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">3. Account Registration</h2>
            <p className="text-gray-300">
              To access certain features of the Services, you may be required to register for an account. 
              When you register for an account, you agree to provide accurate, current, and complete 
              information. You are responsible for maintaining the confidentiality of your account 
              credentials and for all activities that occur under your account.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">4. Subscription and Payment</h2>
            <p className="text-gray-300 mb-4">
              Some of our Services may require payment of fees. All fees are stated in U.S. dollars unless 
              otherwise specified. You agree to pay all applicable fees as described on our website.
            </p>
            <p className="text-gray-300 mb-4">
              When you purchase a subscription, you authorize us to charge the payment method you provide 
              for the subscription fee and any applicable taxes. Subscriptions automatically renew for 
              additional periods equal to the expiring subscription term unless canceled before the renewal date.
            </p>
            <p className="text-gray-300">
              For cryptocurrency payments, transactions are final and non-refundable once confirmed on the 
              blockchain. The subscription will be activated upon confirmation of the payment on the blockchain.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">5. Risk Disclaimer</h2>
            <p className="text-gray-300 mb-4">
              Trading in financial markets involves significant risk of loss and is not suitable for 
              everyone. The information provided through our Services is for educational and informational 
              purposes only and should not be considered financial advice.
            </p>
            <p className="text-gray-300">
              Past performance is not indicative of future results. You are solely responsible for your 
              trading decisions and should conduct your own research and due diligence before making any 
              investment decisions.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">6. Intellectual Property</h2>
            <p className="text-gray-300">
              All content, features, and functionality of the Services, including but not limited to text, 
              graphics, logos, icons, and software, are owned by us or our licensors and are protected by 
              United States and international copyright, trademark, patent, trade secret, and other 
              intellectual property or proprietary rights laws.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">7. Prohibited Conduct</h2>
            <p className="text-gray-300 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Use the Services for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Interfere with or disrupt the operation of the Services</li>
              <li>Share your account credentials with others</li>
              <li>Reverse engineer or decompile any aspect of the Services</li>
              <li>Use the Services to transmit any malware or harmful code</li>
              <li>Scrape or collect data from the Services without our prior written consent</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">8. Limitation of Liability</h2>
            <p className="text-gray-300">
              To the maximum extent permitted by law, in no event shall we be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to 
              loss of profits, data, or business opportunities, arising out of or in connection with 
              your use of the Services.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">9. Changes to Terms</h2>
            <p className="text-gray-300">
              We may revise these Terms at any time. If we make changes, we will provide notice of such 
              changes by posting the revised Terms on our website. Your continued use of the Services 
              following the posting of revised Terms means that you accept and agree to the changes.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">10. Contact Information</h2>
            <p className="text-gray-300">
              If you have any questions about these Terms, please contact us at support@insightflowai.com.
            </p>
          </section>
          <section>
            <p className="text-gray-400 text-sm">Last updated: June 28, 2025</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 