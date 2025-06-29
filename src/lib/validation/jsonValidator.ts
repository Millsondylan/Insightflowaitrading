import Ajv, { ValidateFunction, Options } from 'ajv';
// Lazy-load ajv-formats to avoid type error if not installed yet
let addFormatsFn: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any;
try {
   
  addFormatsFn = require('ajv-formats');
} catch {
  // no-op in case dependency missing; formats not critical
}

import { supabase } from '@/integrations/supabase/client';
import { captureAudit } from '@/lib/monitoring/auditWebhook';

const ajvOptions: Options = { allErrors: true, strict: false } as Options;
const ajv = new Ajv(ajvOptions);
if (addFormatsFn) addFormatsFn(ajv);

const schemaCache = new Map<string, ValidateFunction>();

export async function validatePayload(schemaName: string, payload: unknown): Promise<boolean> {
  let validate = schemaCache.get(schemaName);

  if (!validate) {
    // Load schema from DB
    const { data, error } = await supabase
      .from('json_schema_registry' as any)
      .select('schema')
      .eq('schema_name', schemaName)
      .single();

    if (error || !data) {
      await captureAudit('jsonValidator', 'error', `Schema ${schemaName} not found`, { error });
      return false;
    }

    validate = ajv.compile((data as any).schema);
    schemaCache.set(schemaName, validate);
  }

  const isValid = validate(payload) as boolean;
  if (!isValid) {
    await captureAudit('jsonValidator', 'error', `Validation failed for ${schemaName}`, {
      errors: validate.errors,
      payload,
    });
  }
  return isValid;
} 