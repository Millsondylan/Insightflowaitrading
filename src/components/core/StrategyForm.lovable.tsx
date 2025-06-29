import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { StrategyFormData } from '../../lib/strategy/promptBuilder';

interface StrategyFormProps {
  onSubmit: (formData: StrategyFormData) => void;
  isLoading: boolean;
}

const StrategyForm = ({ onSubmit, isLoading }: StrategyFormProps) => {
  const [formData, setFormData] = useState<StrategyFormData>({
    strategyName: '',
    tradeStyle: '',
    instruments: '',
    timeframe: '',
    entryConditions: '',
    exitConditions: '',
    riskManagement: '',
    extraContext: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const requiredFields: (keyof StrategyFormData)[] = [
      'tradeStyle', 'instruments', 'timeframe', 'entryConditions', 'exitConditions', 'riskManagement'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      style={{ padding: "24px" }}
    >
      <div >
        <motion.div variants={itemVariants} >
          <Label htmlFor="strategyName">Strategy Name (Optional)</Label>
          <Input
            id="strategyName"
            name="strategyName"
            placeholder="E.g., Momentum Breakout"
            value={formData.strategyName}
            onChange={handleChange}
            
          />
        </motion.div>

        <motion.div variants={itemVariants} >
          <Label htmlFor="tradeStyle">Trade Style*</Label>
          <Select
            value={formData.tradeStyle}
            onValueChange={(value) => handleSelectChange(value, 'tradeStyle')}
          >
            <SelectTrigger >
              <SelectValue placeholder="Select a trade style" />
            </SelectTrigger>
            <SelectContent style={{ color: "white" }}>
              <SelectItem value="Intraday">Intraday</SelectItem>
              <SelectItem value="Swing">Swing</SelectItem>
              <SelectItem value="Scalping">Scalping</SelectItem>
              <SelectItem value="Position">Position</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.tradeStyle && (
            <p >{formErrors.tradeStyle}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} >
          <Label htmlFor="instruments">Instruments*</Label>
          <Input
            id="instruments"
            name="instruments"
            placeholder="E.g., BTC, ETH, AAPL"
            value={formData.instruments}
            onChange={handleChange}
            
          />
          {formErrors.instruments && (
            <p >{formErrors.instruments}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} >
          <Label htmlFor="timeframe">Timeframe*</Label>
          <Select
            value={formData.timeframe}
            onValueChange={(value) => handleSelectChange(value, 'timeframe')}
          >
            <SelectTrigger >
              <SelectValue placeholder="Select a timeframe" />
            </SelectTrigger>
            <SelectContent style={{ color: "white" }}>
              <SelectItem value="1m">1 minute</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="15m">15 minutes</SelectItem>
              <SelectItem value="30m">30 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="4h">4 hours</SelectItem>
              <SelectItem value="1d">Daily</SelectItem>
              <SelectItem value="1w">Weekly</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.timeframe && (
            <p >{formErrors.timeframe}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} >
          <Label htmlFor="entryConditions">Entry Conditions*</Label>
          <Textarea
            id="entryConditions"
            name="entryConditions"
            placeholder="Describe your entry conditions..."
            value={formData.entryConditions}
            onChange={handleChange}
            
          />
          {formErrors.entryConditions && (
            <p >{formErrors.entryConditions}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} >
          <Label htmlFor="exitConditions">Exit Conditions*</Label>
          <Textarea
            id="exitConditions"
            name="exitConditions"
            placeholder="Describe your exit conditions..."
            value={formData.exitConditions}
            onChange={handleChange}
            
          />
          {formErrors.exitConditions && (
            <p >{formErrors.exitConditions}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} >
          <Label htmlFor="riskManagement">Risk Management*</Label>
          <Textarea
            id="riskManagement"
            name="riskManagement"
            placeholder="Describe your risk management approach..."
            value={formData.riskManagement}
            onChange={handleChange}
            
          />
          {formErrors.riskManagement && (
            <p >{formErrors.riskManagement}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} >
          <Label htmlFor="extraContext">Extra Context (Optional)</Label>
          <Textarea
            id="extraContext"
            name="extraContext"
            placeholder="Any additional information or context..."
            value={formData.extraContext}
            onChange={handleChange}
            
          />
        </motion.div>

        <motion.div variants={itemVariants} style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            style={{ border: "1px solid #374151", color: "white", width: "100%" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2  /> Generating Strategy...
              </>
            ) : (
              'Generate Strategy'
            )}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default StrategyForm; 