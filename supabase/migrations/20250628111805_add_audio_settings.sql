-- Add audio_settings to the user_settings table
ALTER TABLE public.user_settings
ADD COLUMN audio_settings JSONB DEFAULT '{"sounds_enabled": false, "volume": 80}'::JSONB;

-- Update the UserSettings TypeScript interface in code
COMMENT ON COLUMN public.user_settings.audio_settings IS 'Audio configuration for sound effects and voice narration'; 