import React, { useState } from 'react';
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    <Card style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}>
      <CardHeader>
        <CardTitle style={{ fontWeight: "700" }}>New Trade Journal Entry</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} >
          {/* Title */}
          <div >
            <Label htmlFor="title">Trade Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., ETH Breakout Trade"
              className={cn(errors.title && "border-red-500")}
            />
            {errors.title && <p >{errors.title}</p>}
          </div>
          
          {/* Pair and Timeframe - 2 columns */}
          <div >
            <div >
              <Label htmlFor="pair">Instrument/Pair</Label>
              <Input
                id="pair"
                name="pair"
                value={formData.pair}
                onChange={handleChange}
                placeholder="E.g., ETH/USD"
                className={cn(errors.pair && "border-red-500")}
              />
              {errors.pair && <p >{errors.pair}</p>}
            </div>
            
            <div >
              <Label htmlFor="timeframe">Timeframe</Label>
              <Input
                id="timeframe"
                name="timeframe"
                value={formData.timeframe}
                onChange={handleChange}
                placeholder="E.g., 4H"
                className={cn(errors.timeframe && "border-red-500")}
              />
              {errors.timeframe && <p >{errors.timeframe}</p>}
            </div>
          </div>
          
          {/* Entry and Exit Prices - 2 columns */}
          <div >
            <div >
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                name="entryPrice"
                type="number"
                value={formData.entryPrice}
                onChange={handleChange}
                placeholder="0.00"
                className={cn(errors.entryPrice && "border-red-500")}
              />
              {errors.entryPrice && <p >{errors.entryPrice}</p>}
            </div>
            
            <div >
              <Label htmlFor="exitPrice">Exit Price</Label>
              <Input
                id="exitPrice"
                name="exitPrice"
                type="number"
                value={formData.exitPrice}
                onChange={handleChange}
                placeholder="0.00"
                className={cn(errors.exitPrice && "border-red-500")}
              />
              {errors.exitPrice && <p >{errors.exitPrice}</p>}
            </div>
          </div>
          
          {/* Reason/Notes */}
          <div >
            <Label htmlFor="reason">Reason for Trade</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe your trade setup, strategy, and observations..."
              rows={4}
              className={cn(errors.reason && "border-red-500")}
            />
            {errors.reason && <p >{errors.reason}</p>}
          </div>
          
          {/* Sentiment Toggle */}
          <div >
            <Label>Trade Sentiment</Label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                type="button"
                variant={formData.sentiment === "Bullish" ? "default" : "outline"}
                onClick={handleSentimentToggle}
                className={cn(
                  "w-28",
                  formData.sentiment === "Bullish" && "bg-green-600 hover:bg-green-700"
                )}
              >
                🟢 Bullish
              </Button>
              <Button
                type="button"
                variant={formData.sentiment === "Bearish" ? "default" : "outline"}
                onClick={handleSentimentToggle}
                className={cn(
                  "w-28",
                  formData.sentiment === "Bearish" && "bg-red-600 hover:bg-red-700"
                )}
              >
                🔴 Bearish
              </Button>
            </div>
          </div>
          
          {/* Tags */}
          <div >
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
          <div >
            <Label>Attach Chart Image (Optional)</Label>
            <div 
              style={{ padding: "24px" }}
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.chartFile ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <p >{formData.chartFile.name}</p>
                  <p style={{ color: "#9CA3AF" }}>
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
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <p>Drag and drop your chart image here,</p>
                  <p>or click to select</p>
                  <p style={{ color: "#9CA3AF" }}>PNG, JPG (max 5MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </form>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="button" 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className={cn(
            "w-full font-medium text-lg py-6",
            formData.sentiment === "Bullish" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          )}
        >
          {isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JournalForm; 