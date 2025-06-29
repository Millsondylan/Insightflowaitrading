import React, { useState } from 'react';

export type JournalEntry = {
  id?: string;
  title: string;
  date: string;
  tags: string[];
  notes: string;
  screenshot?: File | null;
  strategyId?: string | null;
};

type JournalEntryFormProps = {
  onSubmit: (entry: JournalEntry) => void;
};

const mockStrategies = [
  { id: 'strat-001', name: 'Momentum Scalp v1' },
  { id: 'strat-002', name: 'Mean Reversion ETH/USD' },
  { id: 'strat-003', name: 'Gold Breakout System' },
];

const JournalEntryForm = ({ onSubmit }: JournalEntryFormProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [notes, setNotes] = useState("");
  const [screenshot, setScreenshot] = useState<span style={{fontSize: '16px'}}>📄</span>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [strategyId, setStrategyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    if (value.includes(',')) {
      const newTags = value.split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag !== '' && !tags.includes(tag));
      if (newTags.length > 0) {
        setTags([...tags, ...newTags]);
      }
      setTagInput("");
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setScreenshot(null);
      setScreenshotPreview(null);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDate(new Date().toISOString().slice(0, 10));
    setTags([]);
    setTagInput("");
    setNotes("");
    setScreenshot(null);
    setScreenshotPreview(null);
    setStrategyId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || isSubmitting) return;

    setIsSubmitting(true);

    const finalTags = [...tags];
    if (tagInput.trim()) {
        const remainingTags = tagInput.split(',')
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag !== '' && !finalTags.includes(tag));
        finalTags.push(...remainingTags);
    }

    const entry: JournalEntry = {
      title,
      date,
      tags: finalTags,
      notes,
      screenshot,
      strategyId,
    };
    
    await onSubmit(entry);
    
    setIsSubmitting(false);
    resetForm();
  };

  const isFormValid = title.trim() !== "" && date.trim() !== "";

  return (
    <div style={{ borderRadius: "0.75rem", padding: "24px", border: "1px solid #374151" }}>
      <h2 style={{ fontWeight: "700", color: "white" }}>New Journal Entry</h2>
      <form onSubmit={handleSubmit} >
        <div>
          <label htmlFor="title" >Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Breakout scalp on BTC"
            style={{ width: "100%", border: "1px solid #374151", color: "white" }}
            required
          />
        </div>

        <div>
          <label htmlFor="date" >Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", border: "1px solid #374151", color: "white" }}
            required
          />
        </div>
        
        <div>
          <label htmlFor="tags" >Tags (comma-separated)</label>
          <div style={{ display: "flex" }}>
            {tags.map(tag => (
              <span key={tag} style={{ display: "flex", alignItems: "center" }}>
                {tag}
                <button type="button" onClick={() => removeTag(tag)} >&times;</button>
              </span>
            ))}
          </div>
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            placeholder="e.g. fomo, scalp, win"
            style={{ width: "100%", border: "1px solid #374151", color: "white" }}
          />
        </div>

        <div>
          <label htmlFor="notes" >Notes</label>
          <textarea
            id="notes"
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detailed thoughts on the trade... Markdown supported."
            style={{ width: "100%", border: "1px solid #374151", color: "white" }}
          />
        </div>

        <div>
          <label htmlFor="strategy" >Link to Strategy (Optional)</label>
          <select
            id="strategy"
            value={strategyId || ""}
            onChange={(e) => setStrategyId(e.target.value || null)}
            style={{ width: "100%", border: "1px solid #374151", color: "white" }}
          >
            <option value="">No linked strategy</option>
            {mockStrategies.map(strat => (
              <option key={strat.id} value={strat.id}>{strat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="screenshot" >Screenshot (Optional)</label>
          <input
            id="screenshot"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: "100%" }}
          />
          {screenshotPreview && (
            <div >
              <img src={screenshotPreview} alt="Screenshot preview" style={{ border: "1px solid #374151" }} />
            </div>
          )}
        </div>
        
        <div >
            <button 
              type="submit" 
              disabled={!isFormValid || isSubmitting}
              style={{ width: "100%", paddingLeft: "16px", paddingRight: "16px", color: "white", fontWeight: "700" }}
            >
              {isSubmitting ? 'Saving...' : '📓 Save Entry'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default JournalEntryForm; 