import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
  const [screenshot, setScreenshot] = useState<File | null>(null);
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
    <div className="rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md shadow-lg space-y-6">
      <h2 className="text-xl font-bold text-white">New Journal Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="block text-sm font-medium text-white/70 mb-1">Title</Label>
          <Input id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Breakout scalp on BTC"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <Label htmlFor="date" className="block text-sm font-medium text-white/70 mb-1">Date</Label>
          <Input id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition calendar-picker-indicator"
            required
          />
        </div>
        <div>
          <Label htmlFor="tags" className="block text-sm font-medium text-white/70 mb-1">Tags (comma-separated)</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span key={tag} className="bg-cyan-800/50 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                {tag}
                <Button type="button" onClick={() => removeTag(tag)} className="text-cyan-400 hover:text-white">&times;</Button>
              </span>
            ))}
          </div>
          <Input
            id="tags"
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            placeholder="e.g. fomo, scalp, win"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
         />
        </div>
        <div>
          <Label htmlFor="notes" className="block text-sm font-medium text-white/70 mb-1">Notes</Label>
          <Textarea
            id="notes"
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detailed thoughts on the trade... Markdown supported."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />
        </div>
        <div>
          <Label htmlFor="strategy" className="block text-sm font-medium text-white/70 mb-1">Link to Strategy (Optional)</Label>
          <Select
            value={strategyId || ""}
            onValueChange={(value) => setStrategyId(value || null)}
          >
            <SelectItem value="">No linked strategy</SelectItem>
            {mockStrategies.map(strat => (
              <SelectItem key={strat.id} value={strat.id}>{strat.name}</SelectItem>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="screenshot" className="block text-sm font-medium text-white/70 mb-1">Screenshot (Optional)</Label>
          <Input
            id="screenshot"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600/80 file:text-white hover:file:bg-cyan-600"
         />
          {screenshotPreview && (
            <div className="mt-4">
              <img src={screenshotPreview} alt="Screenshot preview" className="rounded-lg max-h-48 w-auto border border-white/10"/>
            </div>
          )}
        </div>
        <div className="pt-2">
          <Button type="submit" 
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-cyan-600 hover:bg-cyan-700 px-4 py-3 rounded-full text-white font-bold transition disabled:opacity-40 disabled:cursor-not-allowed">
            {isSubmitting ? 'Saving...' : '📓 Save Entry'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JournalEntryForm;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 