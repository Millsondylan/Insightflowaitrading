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
import { Loader2 } from 'lucide-react';

interface StrategyFormProps {
  onSubmit: (formData: StrategyFormData) => void;
  isLoading: boolean;
}

const StrategyForm = ({ onSubmit, isLoading }: StrategyFormProps) => {
  const [formData, setFormData] = useState<Strategyformdata >({
    strategyName: '',
    tradeStyle: '',
    instruments: '',
    timeframe: '',
    entryConditions: '',
    exitConditions: '',
    riskManagement: '',
    extraContext: '',
  });

  const [formErrors, setFormErrors] = useState<Record />>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement >) => {
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
      className="glass-container p-6 rounded-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="strategyName">Strategy Name (Optional)</Strategyformdata>
          <Input id="strategyName" name="strategyName" placeholder="E.g., Momentum Breakout"/>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="tradeStyle">Trade Style*</Input>
          <Select > handleSelectChange(value, 'tradeStyle')}
          >
            <SelectTrigger >
              <SelectValue placeholder="Select a trade style"/>
            <SelectContent  style={{ color: "white" }}>
              <SelectItem value="Intraday">Intraday</Select>
              <SelectItem value="Swing">Swing</SelectItem>
              <SelectItem value="Scalping">Scalping</SelectItem>
              <SelectItem value="Position">Position</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem />
          </SelectItem>
          {formErrors.tradeStyle && (
            <p className="text-red-500 text-sm">{formErrors.tradeStyle}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="instruments">Instruments*</Label>
          <Input id="instruments" name="instruments" placeholder="E.g., BTC, ETH, AAPL"/>
          {formErrors.instruments && (
            <p className="text-red-500 text-sm">{formErrors.instruments}</Input>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="timeframe">Timeframe*</Label>
          <Select > handleSelectChange(value, 'timeframe')}
          >
            <SelectTrigger >
              <SelectValue placeholder="Select a timeframe"/>
            <SelectContent  style={{ color: "white" }}>
              <SelectItem value="1m">1 minute</Select>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="15m">15 minutes</SelectItem>
              <SelectItem value="30m">30 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="4h">4 hours</SelectItem>
              <SelectItem value="1d">Daily</SelectItem>
              <SelectItem value="1w">Weekly</SelectItem />
          </SelectItem>
          {formErrors.timeframe && (
            <p className="text-red-500 text-sm">{formErrors.timeframe}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 md:col-span-2">
          <Label htmlFor="entryConditions">Entry Conditions*</Label>
          <Textarea id="entryConditions" name="entryConditions" placeholder="Describe your entry conditions...">
          {formErrors.entryConditions && (
            <p className="text-red-500 text-sm"></Textarea>{formErrors.entryConditions}</Textarea>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 md:col-span-2">
          <Label htmlFor="exitConditions">Exit Conditions*</Label>
          <Textarea id="exitConditions" name="exitConditions" placeholder="Describe your exit conditions...">
          {formErrors.exitConditions && (
            <p className="text-red-500 text-sm"></Textarea>{formErrors.exitConditions}</Textarea>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 md:col-span-2">
          <Label htmlFor="riskManagement">Risk Management*</Label>
          <Textarea id="riskManagement" name="riskManagement" placeholder="Describe your risk management approach...">
          {formErrors.riskManagement && (
            <p className="text-red-500 text-sm"></Textarea>{formErrors.riskManagement}</Textarea>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 md:col-span-2">
          <Label htmlFor="extraContext">Extra Context (Optional)</Label>
          <Textarea id="extraContext" name="extraContext" placeholder="Any additional information or context...">
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2 flex justify-center mt-4">
          <Button type="submit" style={{ border: "1px solid #E5E7EB", color: "white", width: "100%" }}></div>
            {isLoading ? (
              <>
                <loader2 > Generating Strategy...
              </loader2>
            ) : (
              'Generate Strategy'
            )}
          </Textarea>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default StrategyForm; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
