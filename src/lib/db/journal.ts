import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type JournalEntry = Tables<'journal_entries'>;
export type AIReflection = Tables<'ai_reflections'>;

export async function createJournalEntry(
  userId: string,
  data: {
    title: string;
    pair: string;
    timeframe: string;
    entryprice: number;
    exitprice: number;
    reason: string;
    sentiment: string;
    charturl?: string;
    tags?: string[];
  }
): Promise<{ entry: JournalEntry | null; error: Error | null }> {
  const { data: entry, error } = await supabase
    .from('journal_entries')
    .insert([
      {
        userid: userId,
        createdat: new Date().toISOString(),
        ...data,
      },
    ])
    .select()
    .single();

  return { entry, error };
}

export async function updateJournalEntry(
  entryId: string,
  userId: string,
  updates: Partial<JournalEntry>
): Promise<{ entry: JournalEntry | null; error: Error | null }> {
  const { data: entry, error } = await supabase
    .from('journal_entries')
    .update(updates)
    .eq('id', entryId)
    .eq('userid', userId)
    .select()
    .single();

  return { entry, error };
}

export async function deleteJournalEntry(
  entryId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId)
    .eq('userid', userId);

  return { error };
}

export async function getJournalEntry(
  entryId: string
): Promise<{ entry: JournalEntry | null; error: Error | null }> {
  const { data: entry, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', entryId)
    .single();

  return { entry, error };
}

export async function getUserJournalEntries(
  userId: string,
  options?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
    sentiment?: string;
    tags?: string[];
  }
): Promise<{ entries: JournalEntry[]; error: Error | null }> {
  let query = supabase
    .from('journal_entries')
    .select('*')
    .eq('userid', userId);

  if (options?.startDate) {
    query = query.gte('createdat', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('createdat', options.endDate);
  }

  if (options?.sentiment) {
    query = query.eq('sentiment', options.sentiment);
  }

  if (options?.tags && options.tags.length > 0) {
    query = query.contains('tags', options.tags);
  }

  query = query.order('createdat', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: entries, error } = await query;

  return { entries: entries || [], error };
}

export async function createAIReflection(
  userId: string,
  journalEntryId: string,
  data: {
    summary: string;
    tags: string[];
    suggestion: string;
    confidence: number;
    provider?: string;
  }
): Promise<{ reflection: AIReflection | null; error: Error | null }> {
  const { data: reflection, error } = await supabase
    .from('ai_reflections')
    .insert([
      {
        userid: userId,
        journalentryid: journalEntryId,
        createdat: new Date().toISOString(),
        ...data,
      },
    ])
    .select()
    .single();

  return { reflection, error };
}

export async function getJournalEntryReflections(
  journalEntryId: string
): Promise<{ reflections: AIReflection[]; error: Error | null }> {
  const { data: reflections, error } = await supabase
    .from('ai_reflections')
    .select('*')
    .eq('journalentryid', journalEntryId)
    .order('createdat', { ascending: false });

  return { reflections: reflections || [], error };
}

export async function getUserReflections(
  userId: string,
  options?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<{ reflections: AIReflection[]; error: Error | null }> {
  let query = supabase
    .from('ai_reflections')
    .select('*')
    .eq('userid', userId);

  if (options?.startDate) {
    query = query.gte('createdat', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('createdat', options.endDate);
  }

  query = query.order('createdat', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: reflections, error } = await query;

  return { reflections: reflections || [], error };
} 