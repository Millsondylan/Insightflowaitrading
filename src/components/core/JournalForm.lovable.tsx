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

const JournalForm: React.FC<Journalformprops > = ({ onEntryAdded }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Journalformdata  />({
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
  const [errors, setErrors] = useState<Journalformerrors >({});
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement >) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, chartFile: file }));
  };
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement >) => {
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
  
  const fileInputRef = React.createRef<HTMLInputElement >();
  
  return (
    <Card  style={{ width: "100%" }}>
      <Cardheader  />
        <Cardtitle  style={{ fontSize: "1.25rem", fontWeight: "700" }}>New Trade Journal Entry</Journalformprops />
      
      <Cardcontent >
        <Form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Div className="space-y-2">
            <Label htmlFor="title">Trade Title</Journalformprops>
            <Input id="title" name="title" placeholder="E.g., ETH Breakout Trade"  />
            {errors.title && <P className="text-sm text-red-500">{errors.title}</Input>}
          </Div>
          
          {/* Pair and Timeframe - 2 columns */}
          <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Div className="space-y-2">
              <Label htmlFor="pair">Instrument/Pair</Div>
              <Input id="pair" name="pair" placeholder="E.g., ETH/USD"  />
              {errors.pair && <P className="text-sm text-red-500">{errors.pair}</Input>}
            </Div>
            
            <Div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Div>
              <Input id="timeframe" name="timeframe" placeholder="E.g., 4H"  />
              {errors.timeframe && <P className="text-sm text-red-500">{errors.timeframe}</Input>}
            </Div>
          </Div>
          
          {/* Entry and Exit Prices - 2 columns */}
          <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Div>
              <Input id="entryPrice" name="entryPrice" type="number" placeholder="0.00"  />
              {errors.entryPrice && <P className="text-sm text-red-500">{errors.entryPrice}</Input>}
            </Div>
            
            <Div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price</Div>
              <Input id="exitPrice" name="exitPrice" type="number" placeholder="0.00"  />
              {errors.exitPrice && <P className="text-sm text-red-500">{errors.exitPrice}</Input>}
            </Div>
          </Div>
          
          {/* Reason/Notes */}
          <Div className="space-y-2">
            <Label htmlFor="reason">Reason for Trade</Div>
            <Textarea id="reason" name="reason" placeholder="Describe your trade setup, strategy, and observations...">
            {errors.reason && <P className="text-sm text-red-500">{errors.reason}</Textarea>}
          </Div>
          
          {/* Sentiment Toggle */}
          <Div className="space-y-2">
            <Label >Trade Sentiment</Div>
            <Div className="flex items-center space-x-2">
              <Button type="button">
                🟢 Bullish
              </Div>
              <Button type="button">
                🔴 Bearish
              </Button>
            </Div>
          </Div>
          
          {/* Tags */}
          <Div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Div>
            <Input id="tags" name="tags" placeholder="E.g., breakout, trend-following, support"  / />
          
          {/* Chart Upload */}
          <Div className="space-y-2">
            <Label >Attach Chart Image (Optional)</Input>
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
                  <Button type="button" variant="ghost" size="sm"> {
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
              / />
          </div />
      </Input>
      
      <cardfooter >
        <Button type="button">
          {isSubmitting ? "Saving..." : "Save Entry"}
        </button />
    </Button>
  );
};

export default JournalForm; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
