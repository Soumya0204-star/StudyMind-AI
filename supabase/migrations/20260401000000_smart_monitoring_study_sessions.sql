-- Migration: Add Smart Webcam Monitoring metrics to study_sessions table

ALTER TABLE public.study_sessions
  ADD COLUMN IF NOT EXISTS monitoring_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS active_duration INTEGER,
  ADD COLUMN IF NOT EXISTS paused_duration INTEGER,
  ADD COLUMN IF NOT EXISTS pause_events INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS presence_ratio NUMERIC;

COMMENT ON COLUMN public.study_sessions.monitoring_enabled IS 'Whether browser-side pose monitoring was enabled for this session';
COMMENT ON COLUMN public.study_sessions.active_duration IS 'Duration in seconds student was verified present and seated at study desk';
COMMENT ON COLUMN public.study_sessions.paused_duration IS 'Duration in seconds the session was paused';
COMMENT ON COLUMN public.study_sessions.pause_events IS 'Number of auto-pause events triggered during session';
COMMENT ON COLUMN public.study_sessions.presence_ratio IS 'Ratio of active study duration to total duration';
