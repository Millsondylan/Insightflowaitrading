
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry, JournalFormData } from './schema';

/**
 * Uploads an image file to Supabase storage
 * @param file Image file to upload
 * @param userId User ID for folder organization
 * @returns URL of the uploaded image
 */
async function uploadChartImage(file: File, userId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/journal/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('trade-charts')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading chart image:', uploadError);
      return null;
    }

    // Get the public URL
    const { data: publicURL } = supabase.storage
      .from('trade-charts')
      .getPublicUrl(filePath);

    return publicURL?.publicUrl || null;
  } catch (error) {
    console.error('Error in uploadChartImage:', error);
    return null;
  }
}

/**
 * Saves a journal entry to Supabase using correct column names
 * @param formData Journal entry form data
 * @param userId Current user ID
 * @returns The saved journal entry or null on error
 */
export async function saveEntry(
  formData: JournalFormData, 
  userId: string
): Promise<JournalEntry | null> {
  try {
    // Upload chart image if provided
    let chartUrl: string | null = null;
    if (formData.chartFile) {
      chartUrl = await uploadChartImage(formData.chartFile, userId);
    }

    // Parse tags from comma-separated string
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    // Create the journal entry with current timestamp using correct column names
    const now = new Date().toISOString();
    
    const entryData = {
      title: formData.title,
      pair: formData.pair,
      timeframe: formData.timeframe,
      entryprice: Number(formData.entryPrice),
      exitprice: Number(formData.exitPrice),
      charturl: chartUrl || null,
      reason: formData.reason,
      sentiment: formData.sentiment,
      tags,
      userid: userId,
      createdat: now
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([entryData])
      .select()
      .single();

    if (error) {
      console.error('Error saving journal entry:', error);
      return null;
    }

    // Map database response back to expected format
    return {
      id: data.id,
      title: data.title,
      pair: data.pair,
      timeframe: data.timeframe,
      entryPrice: data.entryprice,
      exitPrice: data.exitprice,
      chartUrl: data.charturl,
      reason: data.reason,
      sentiment: data.sentiment,
      tags: data.tags,
      createdAt: data.createdat,
      userId: data.userid
    } as JournalEntry;
  } catch (error) {
    console.error('Error in saveEntry:', error);
    return null;
  }
}
