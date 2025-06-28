import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { processPayment } from './payments';
import { PaymentMethod, SubscriptionTier } from './types';

interface PaymentFormProps {
  selectedTier: SubscriptionTier;
  onPaymentComplete: (transactionId: string) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedTier,
  onPaymentComplete
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await processPayment({
        method: paymentMethod,
        details: formData,
        tier: selectedTier
      });

      onPaymentComplete(result.transactionId);
      toast({
        title: 'Payment Successful',
        description: `Your subscription to ${selectedTier.name} has been activated.`,
        variant: 'default'
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Payment Failed',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
        <p className="text-sm text-muted-foreground">
          Complete your subscription to {selectedTier.name} - ${selectedTier.price}/month
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
              className="grid grid-cols-3 gap-4 mt-2"
            >
              <div>
                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <svg
                    className="mb-3 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Credit Card</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="crypto" id="crypto" className="peer sr-only" />
                <Label
                  htmlFor="crypto"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <svg
                    className="mb-3 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Crypto</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                <Label
                  htmlFor="paypal"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <svg
                    className="mb-3 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">PayPal</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === 'card' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="mt-1"
                  />
                </div>
              </div>
            </>
          )}

          {paymentMethod === 'crypto' && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Crypto Payment Instructions</h4>
                <p className="text-sm text-muted-foreground">
                  Send {selectedTier.cryptoPrice} {selectedTier.cryptoCurrency} to the following address:
                </p>
                <code className="block p-2 mt-2 bg-background rounded border">
                  {selectedTier.cryptoAddress}
                </code>
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You will be redirected to PayPal to complete your payment.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Processing Payment...</span>
            </div>
          ) : (
            `Pay ${selectedTier.price} USD`
          )}
        </Button>
      </form>
    </Card>
  );
}; 