import React, { useState } from 'react';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  cryptoPrice: number;
  cryptoCurrency: string;
  cryptoAddress: string;
  features: string[];
  interval: 'monthly' | 'yearly';
}

interface PaymentFormProps {
  selectedTier: SubscriptionTier;
  onPaymentComplete: (transactionId: string) => void;
}

export const PaymentForm: React.FC<paymentFormProps> = ({
  selectedTier,
  onPaymentComplete
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionId = `tx_${Math.random().toString(36).substr(2, 9)}`;
      onPaymentComplete(transactionId);
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            {selectedTier.name}
          </h2>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>
            ${selectedTier.price}
            <span style={{ fontSize: '16px', color: '#6b7280' }}>
              /{selectedTier.interval}
            </span>
          </div>
        </div>
        <div style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '12px',
          minWidth: '200px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
            Features:
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {selectedTier.features.map((feature, index) => (
              <li key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                <span style={{ color: '#2563eb' }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
          Payment Method
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button  onClick={() => setPaymentMethod('card')}
            style={{
              padding: '12px 24px',
              backgroundColor: paymentMethod === 'card' ? '#2563eb' : '#f3f4f6',
              color: paymentMethod === 'card' ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              flex: 1,
              textAlign: 'center'
            }}
          >
            💳 Credit Card
          </button>
          <button  onClick={() => setPaymentMethod('crypto')}
            style={{
              padding: '12px 24px',
              backgroundColor: paymentMethod === 'crypto' ? '#2563eb' : '#f3f4f6',
              color: paymentMethod === 'crypto' ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              flex: 1,
              textAlign: 'center'
            }}
          >
            ₿ Crypto
          </button>
        </div>
      </div>

      {paymentMethod === 'card' ? (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              Card Number
            </label>
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                CVC
              </label>
              <input
                type="text"
                placeholder="123"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
              Amount
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {selectedTier.cryptoPrice} {selectedTier.cryptoCurrency}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
              Send to address
            </div>
            <div style={{
              fontSize: '14px',
              fontFamily: 'monospace',
              padding: '8px',
              backgroundColor: 'white',
              borderRadius: '6px'
            }}>
              {selectedTier.cryptoAddress}
            </div>
          </div>
        </div>
      )}

      <button onClick={handlePayment}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: loading ? '#9ca3af' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
    >
        {loading ? 'Processing...' : `Pay ${paymentMethod === 'card' ? '$' + selectedTier.price : selectedTier.cryptoPrice + ' ' + selectedTier.cryptoCurrency}`}
      </button>

      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}; 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default payments;
