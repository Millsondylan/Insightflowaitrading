
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { JournalFormData, JournalFormErrors } from "@/lib/journal/schema";
import { saveEntry } from "@/lib/journal/saveEntry";
import { cn } from "@/lib/utils";

// Dummy user ID for development until auth is implemented
const DUMMY_USER_ID = "current-user-id";

interface JournalFormProps {
  onEntryAdded?: () => void;
}

const JournalForm: React.FC<JournalFormProps> = ({ onEntryAdded }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<JournalFormData>({
    title: "",
    pair: "",
    timeframe: "",
    entryPrice: '',
    exitPrice: '',
    reason: "",
    sentiment: "Bullish",
    tags: "",
    chartFile: null
  });
  const [errors, setErrors] = useState<JournalFormErrors>({});
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, chartFile: file }));
  };
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name as keyof JournalFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  // Toggle sentiment between Bullish and Bearish
  const handleSentimentToggle = () => {
    setFormData(prev => ({
      ...prev,
      sentiment: prev.sentiment === "Bullish" ? "Bearish" : "Bullish"
    }));
  };
  
  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: JournalFormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.pair.trim()) {
      newErrors.pair = "Instrument/pair is required";
    }
    
    if (!formData.timeframe.trim()) {
      newErrors.timeframe = "Timeframe is required";
    }
    
    if (!formData.entryPrice) {
      newErrors.entryPrice = "Entry price is required";
    }
    
    if (!formData.exitPrice) {
      newErrors.exitPrice = "Exit price is required";
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = "Trade reason is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await saveEntry(formData, DUMMY_USER_ID);
      
      if (result) {
        toast({
          title: "Entry Saved",
          description: "Your trade journal entry has been saved successfully."
        });
        
        // Reset form
        setFormData({
          title: "",
          pair: "",
          timeframe: "",
          entryPrice: '',
          exitPrice: '',
          reason: "",
          sentiment: "Bullish",
          tags: "",
          chartFile: null
        });
        
        // Notify parent component
        if (onEntryAdded) {
          onEntryAdded();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save your entry. Please try again."
        });
      }
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const fileInputRef = React.createRef<HTMLInputElement>();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">New Trade Journal Entry</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Trade Title</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., ETH Breakout Trade"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>
          
          {/* Pair and Timeframe - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pair">Instrument/Pair</Label>
              <Input 
                id="pair" 
                name="pair" 
                value={formData.pair}
                onChange={handleChange}
                placeholder="E.g., ETH/USD"
              />
              {errors.pair && <p className="text-sm text-red-500">{errors.pair}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Input 
                id="timeframe" 
                name="timeframe" 
                value={formData.timeframe}
                onChange={handleChange}
                placeholder="E.g., 4H"
              />
              {errors.timeframe && <p className="text-sm text-red-500">{errors.timeframe}</p>}
            </div>
          </div>
          
          {/* Entry and Exit Prices - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input 
                id="entryPrice" 
                name="entryPrice" 
                type="number" 
                value={formData.entryPrice}
                onChange={handleChange}
                placeholder="0.00"
              />
              {errors.entryPrice && <p className="text-sm text-red-500">{errors.entryPrice}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price</Label>
              <Input 
                id="exitPrice" 
                name="exitPrice" 
                type="number" 
                value={formData.exitPrice}
                onChange={handleChange}
                placeholder="0.00"
              />
              {errors.exitPrice && <p className="text-sm text-red-500">{errors.exitPrice}</p>}
            </div>
          </div>
          
          {/* Reason/Notes */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Trade</Label>
            <Textarea 
              id="reason" 
              name="reason" 
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe your trade setup, strategy, and observations..."
            />
            {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
          </div>
          
          {/* Sentiment Toggle */}
          <div className="space-y-2">
            <Label>Trade Sentiment</Label>
            <div className="flex items-center space-x-2">
              <Button 
                type="button" 
                variant={formData.sentiment === "Bullish" ? "default" : "outline"}
                onClick={handleSentimentToggle}
              >
                🟢 Bullish
              </Button>
              <Button 
                type="button" 
                variant={formData.sentiment === "Bearish" ? "default" : "outline"}
                onClick={handleSentimentToggle}
              >
                🔴 Bearish
              </Button>
            </div>
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input 
              id="tags" 
              name="tags" 
              value={formData.tags}
              onChange={handleChange}
              placeholder="E.g., breakout, trend-following, support"
            />
          </div>
          
          {/* Chart Upload */}
          <div className="space-y-2">
            <Label>Attach Chart Image (Optional)</Label>
            <div 
              className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors file-upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.chartFile ? (
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium">{formData.chartFile.name}</p>
                  <p className="text-xs text-gray-400">
                    {(formData.chartFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, chartFile: null }));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p>Drag and drop your chart image here,</p>
                  <p>or click to select</p>
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG (max 5MB)</p>
                </div>
              )}
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </form>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JournalForm;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
