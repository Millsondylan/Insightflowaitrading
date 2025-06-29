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
      className="glass-container p-6 rounded-lg"
    >
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="strategyName">Strategy Name (Optional)</StrategyFormData>
          <Input
            id="strategyName"
            name="strategyName"
            placeholder="E.g., Momentum Breakout"
            value={formData.strategyName}
            onChange={handleChange}
            className="bg-black/30 border-gray-700"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="tradeStyle">Trade Style*</Input>
          <Select
            value={formData.tradeStyle}
            onValueChange={(value) => handleSelectChange(value, 'tradeStyle')}
          >
            <selectTrigger className="bg-black/30 border-gray-700">
              <selectValue placeholder="Select a trade style" />
            </Select>
            <selectContent className="bg-black/90 border-gray-700 text-white">
              <selectItem value="Intraday">Intraday</SelectItem>
              <selectItem value="Swing">Swing</SelectItem>
              <selectItem value="Scalping">Scalping</SelectItem>
              <selectItem value="Position">Position</SelectItem>
              <selectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.tradeStyle && (
            <P className="text-red-500 text-sm">{formErrors.tradeStyle}</P>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="instruments">Instruments*</Label>
          <Input
            id="instruments"
            name="instruments"
            placeholder="E.g., BTC, ETH, AAPL"
            value={formData.instruments}
            onChange={handleChange}
            className="bg-black/30 border-gray-700"
          />
          {formErrors.instruments && (
            <P className="text-red-500 text-sm">{formErrors.instruments}</Input>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="timeframe">Timeframe*</Label>
          <Select
            value={formData.timeframe}
            onValueChange={(value) => handleSelectChange(value, 'timeframe')}
          >
            <selectTrigger className="bg-black/30 border-gray-700">
              <selectValue placeholder="Select a timeframe" />
            </Select>
            <selectContent className="bg-black/90 border-gray-700 text-white">
              <selectItem value="1m">1 minute</SelectItem>
              <selectItem value="5m">5 minutes</SelectItem>
              <selectItem value="15m">15 minutes</SelectItem>
              <selectItem value="30m">30 minutes</SelectItem>
              <selectItem value="1h">1 hour</SelectItem>
              <selectItem value="4h">4 hours</SelectItem>
              <selectItem value="1d">Daily</SelectItem>
              <selectItem value="1w">Weekly</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.timeframe && (
            <P className="text-red-500 text-sm">{formErrors.timeframe}</P>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 md:col-span-2">
          <Label htmlFor="entryConditions">Entry Conditions*</Label>
          <Textarea
            id="entryConditions"
            name="entryConditions"
            placeholder="Describe your entry conditions..."
            value={formData.entryConditions}
            onChange={handleChange}
            className="bg-black/30 border-gray-700 min-h-[100px]"
          />
          {formErrors.entryConditions && (
            <P className="text-red-500 text-sm">{formErrors.entryConditions}</Textarea>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 md:col-span-2">
          <Label htmlFor="exitConditions">Exit Conditions*</Label>
          <Textarea
            id="exitConditions"
            name="exitConditions"
            placeholder="Describe your exit conditions..."
            value={formData.exitConditions}
            onChange={handleChange}
            className="bg-black/30 border-gray-700 min-h-[100px]"
          />
          {formErrors.exitConditions && (
            <P className="text-red-500 text-sm">{formErrors.exitConditions}</Textarea>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 md:col-span-2">
          <Label htmlFor="riskManagement">Risk Management*</Label>
          <Textarea
            id="riskManagement"
            name="riskManagement"
            placeholder="Describe your risk management approach..."
            value={formData.riskManagement}
            onChange={handleChange}
            className="bg-black/30 border-gray-700 min-h-[100px]"
          />
          {formErrors.riskManagement && (
            <P className="text-red-500 text-sm">{formErrors.riskManagement}</Textarea>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 md:col-span-2">
          <Label htmlFor="extraContext">Extra Context (Optional)</Label>
          <Textarea
            id="extraContext"
            name="extraContext"
            placeholder="Any additional information or context..."
            value={formData.extraContext}
            onChange={handleChange}
            className="bg-black/30 border-gray-700"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2 flex justify-center mt-4">
          <Button type="submit"
            className="glow-button bg-cyan-500/20 border border-cyan-500 text-white hover:bg-cyan-500/30 hover:scale-105 transition-all duration-300 w-full md:w-auto px-8 py-6"
            disabled={isLoading}
     >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Strategy...
              </>
            ) : (
              'Generate Strategy'
            )}
          </Textarea>
        </motion.div>
      </Div>
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