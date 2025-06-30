import React, { useState } from 'react';
import { Button } from './Button';

type TradeFormData = {
  symbol: string;
  quantity: number;
  price: number;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
};

type FormErrors = {
  symbol?: string;
  quantity?: string;
  price?: string;
  type?: string;
  orderType?: string;
};

type TradingFormProps = {
  onSubmit: (data: TradeFormData) => void;
};

export const TradingForm = ({ onSubmit }: TradingFormProps) => {
  const [formData, setFormData] = useState<TradeFormData>({
    symbol: '',
    quantity: 1,
    price: 0,
    type: 'buy',
    orderType: 'market'
  });

  const [errors, setErrors] = useState<formErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (formData.orderType === 'limit' && (!formData.price || formData.price <= 0)) {
      newErrors.price = 'Price must be greater than 0 for limit orders';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const inputStyles = {
    width: '100%',
    padding: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box' as const
  };

  const errorStyles = {
    color: '#EF4444',
    fontSize: '14px',
    marginTop: '4px'
  };

  const labelStyles = {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    display: 'block'
  };

  return (
    <div style={{
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      padding: '32px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      maxWidth: '400px'
    }}>
      <h3 style={{
        color: 'white',
        fontSize: '24px',
        fontWeight: '600',
        margin: '0 0 24px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📈 Place Trade
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <Label style={labelStyles}>Symbol</Label>
          <Input type="text"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
            placeholder="e.g., AAPL, TSLA, BTC"
            style={{
              ...inputStyles,
              borderColor: errors.symbol ? '#EF4444' : 'rgba(255, 255, 255, 0.1)'
            }}
            onFocus={(e) => {
              if (!errors.symbol) {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }
            }}
            onBlur={(e) => {
              if (!errors.symbol) {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }
            }}
          />
          {errors.symbol && <div style={errorStyles}>{errors.symbol}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <Label style={labelStyles}>Trade Type</Label>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'buy' | 'sell' })}
              style={{
                ...inputStyles,
                cursor: 'pointer'
              }}
            >
              <option value="buy" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Buy</option>
              <option value="sell" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Sell</option>
            </Select>
          </div>

          <div>
            <Label style={labelStyles}>Order Type</Label>
            <Select
              value={formData.orderType}
              onChange={(e) => setFormData({ ...formData, orderType: e.target.value as 'market' | 'limit' })}
              style={{
                ...inputStyles,
                cursor: 'pointer'
              }}
            >
              <option value="market" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Market</option>
              <option value="limit" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Limit</option>
            </Select>
          </div>
        </div>

        <div>
          <Label style={labelStyles}>Quantity</Label>
          <Input type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            style={{
              ...inputStyles,
              borderColor: errors.quantity ? '#EF4444' : 'rgba(255, 255, 255, 0.1)'
            }}
            onFocus={(e) => {
              if (!errors.quantity) {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }
            }}
            onBlur={(e) => {
              if (!errors.quantity) {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }
            }}
          />
          {errors.quantity && <div style={errorStyles}>{errors.quantity}</div>}
        </div>

        {formData.orderType === 'limit' && (
          <div>
            <Label style={labelStyles}>Limit Price</Label>
            <Input type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              style={{
                ...inputStyles,
                borderColor: errors.price ? '#EF4444' : 'rgba(255, 255, 255, 0.1)'
              }}
              onFocus={(e) => {
                if (!errors.price) {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }
              }}
              onBlur={(e) => {
                if (!errors.price) {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            />
            {errors.price && <div style={errorStyles}>{errors.price}</div>}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Button type="submit"
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: formData.type === 'buy' ? '#3B82F6' : '#EF4444',
              color: 'white',
              border: `1px solid ${formData.type === 'buy' ? '#3B82F6' : '#EF4444'}`,
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            {formData.type === 'buy' ? '🟢 Buy' : '🔴 Sell'} {formData.symbol || 'Asset'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 