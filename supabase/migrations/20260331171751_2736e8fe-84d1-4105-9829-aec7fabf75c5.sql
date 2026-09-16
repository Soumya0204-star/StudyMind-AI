
CREATE TABLE public.performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  marks NUMERIC NOT NULL,
  total_marks NUMERIC NOT NULL DEFAULT 100,
  weak_topics TEXT[] DEFAULT '{}',
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own performance" ON public.performance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own performance" ON public.performance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own performance" ON public.performance FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own performance" ON public.performance FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_performance_updated_at BEFORE UPDATE ON public.performance FOR EACH ROW EXECUTE FUNCTION update_updated_at();
