-- ============================================================
-- SETUP DATABASE tcr-notes v0.0.2.2
-- Esegui queste query nell'SQL Editor di Supabase
-- ============================================================

-- Tabella titoli
CREATE TABLE IF NOT EXISTS public.titles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabella capitoli
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id UUID REFERENCES public.titles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  content TEXT DEFAULT '',
  last_edited_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(title_id, name)
);

-- Tabella cronologia
CREATE TABLE IF NOT EXISTS public.history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  content TEXT DEFAULT '',
  edited_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Abilita Row Level Security
ALTER TABLE public.titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

-- Policy aperte (modificare in produzione se necessario)
CREATE POLICY "Allow all" ON public.titles
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all" ON public.chapters
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all" ON public.history
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Abilita Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.titles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chapters;
