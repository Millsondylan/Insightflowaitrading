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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement />) => {
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
    <Card className="w-full max-w-2xl mx-auto journal-form-card" />
      <CardHeader>
        <CardTitle className="text-xl font-bold" />New Trade Journal Entry</JournalFormProps>
      </CardHeader>
      
      <CardContent>
        <Form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Div className="space-y-2">
            <Label htmlFor="title">Trade Title</CardContent>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., ETH Breakout Trade"
              className={cn(errors.title && "border-red-500")}
            />
            {errors.title && <P className="text-sm text-red-500">{errors.title}</Input>}
          </Div>
          
          {/* Pair and Timeframe - 2 columns */}
          <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Div className="space-y-2">
              <Label htmlFor="pair">Instrument/Pair</Div>
              <Input
                id="pair"
                name="pair"
                value={formData.pair}
                onChange={handleChange}
                placeholder="E.g., ETH/USD"
                className={cn(errors.pair && "border-red-500")}
              />
              {errors.pair && <P className="text-sm text-red-500">{errors.pair}</Input>}
            </Div>
            
            <Div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Div>
              <Input
                id="timeframe"
                name="timeframe"
                value={formData.timeframe}
                onChange={handleChange}
                placeholder="E.g., 4H"
                className={cn(errors.timeframe && "border-red-500")}
              />
              {errors.timeframe && <P className="text-sm text-red-500">{errors.timeframe}</Input>}
            </Div>
          </Div>
          
          {/* Entry and Exit Prices - 2 columns */}
          <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Div>
              <Input
                id="entryPrice"
                name="entryPrice"
                type="number"
                value={formData.entryPrice}
                onChange={handleChange}
                placeholder="0.00"
                className={cn(errors.entryPrice && "border-red-500")}
              />
              {errors.entryPrice && <P className="text-sm text-red-500">{errors.entryPrice}</Input>}
            </Div>
            
            <Div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price</Div>
              <Input
                id="exitPrice"
                name="exitPrice"
                type="number"
                value={formData.exitPrice}
                onChange={handleChange}
                placeholder="0.00"
                className={cn(errors.exitPrice && "border-red-500")}
              />
              {errors.exitPrice && <P className="text-sm text-red-500">{errors.exitPrice}</Input>}
            </Div>
          </Div>
          
          {/* Reason/Notes */}
          <Div className="space-y-2">
            <Label htmlFor="reason">Reason for Trade</Div>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe your trade setup, strategy, and observations..."
              rows={4}
              className={cn(errors.reason && "border-red-500")}
            />
            {errors.reason && <P className="text-sm text-red-500">{errors.reason}</Textarea>}
          </Div>
          
          {/* Sentiment Toggle */}
          <Div className="space-y-2">
            <Label>Trade Sentiment</Div>
            <Div className="flex items-center space-x-2">
              <Button type="button"
                variant={formData.sentiment === "Bullish" ? "default" : "outline"}
                onClick={handleSentimentToggle}
                className={cn(
                  "w-28",
                  formData.sentiment === "Bullish" && "bg-green-600 hover:bg-green-700"
                )}
         >
                🟢 Bullish
              </Div>
              <Button type="button"
                variant={formData.sentiment === "Bearish" ? "default" : "outline"}
                onClick={handleSentimentToggle}
                className={cn(
                  "w-28",
                  formData.sentiment === "Bearish" && "bg-red-600 hover:bg-red-700"
                )}
              />
                🔴 Bearish
              </Button>
            </Div>
          </Div>
          
          {/* Tags */}
          <Div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Div>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="E.g., breakout, trend-following, support"
            />
          </Input>
          
          {/* Chart Upload */}
          <Div className="space-y-2">
            <Label>Attach Chart Image (Optional)</Div>
            <Div 
              className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors file-upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.chartFile ? (
                <Div className="flex flex-col items-center">
                  <P className="text-sm font-medium">{formData.chartFile.name}</Div>
                  <P className="text-xs text-gray-400">
                    {(formData.chartFile.size / 1024 / 1024).toFixed(2)} MB
                  </P>
                  <Button type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) = /> {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, chartFile: null }));
                    }}
                  >
                    Remove
                  </Button>
                </Div>
              ) : (
                <Div className="flex flex-col items-center">
                  <P>Drag and drop your chart image here,</Div>
                  <P>or click to select</P>
                  <P className="text-xs text-gray-400 mt-2">PNG, JPG (max 5MB)</P>
                </Div>
              )}
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
              />
            </Input>
          </Div>
        </Form>
      </CardContent>
      
      <CardFooter>
        <Button type="button" 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className={cn(
            "w-full font-medium text-lg py-6",
            formData.sentiment === "Bullish" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          )}
    ></CardFooter></CardFooter>
          {isSubmitting ? "Saving..." : "Save Entry"}
        </CardFooter>
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