-- Create the user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  working_hours_per_day NUMERIC(5,2) DEFAULT 8.0 NOT NULL,
  working_days_per_week INTEGER DEFAULT 5 NOT NULL,
  internal_hours_limit NUMERIC(5,2) DEFAULT 20.0 NOT NULL,
  commercial_hours_limit NUMERIC(5,2) DEFAULT 20.0 NOT NULL,
  CONSTRAINT user_settings_user_id_key UNIQUE (user_id)
);

-- Set RLS (Row Level Security) policies
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting user's own settings
CREATE POLICY "Users can view their own settings"
  ON public.user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for inserting user's own settings
CREATE POLICY "Users can insert their own settings"
  ON public.user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for updating user's own settings
CREATE POLICY "Users can update their own settings"
  ON public.user_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at(); 