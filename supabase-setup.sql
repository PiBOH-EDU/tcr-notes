-- Tabella note per l'app Catcher Notes
-- Esegui questa query nell'SQL Editor di Supabase

create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text default '',
  last_edited_by text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Abilita Row Level Security
alter table public.notes enable row level security;

-- Policy aperta per anon/authenticated (da restringere in produzione se necessario)
create policy "Allow all access" on public.notes
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Abilita Realtime per la tabella notes
alter publication supabase_realtime add table public.notes;

-- Inserimento dati di esempio (opzionale)
insert into public.notes (title, content) values
  ('Capitolo 1 — Holden', ''),
  ('Capitolo 2 — La famiglia', ''),
  ('Capitolo 3 — Pencey Prep', ''),
  ('Capitolo 4 — Ackley e Stradlater', ''),
  ('Capitolo 5 — La lotta', ''),
  ('Capitolo 6 — Dopo la lotta', ''),
  ('Capitolo 7 — Addio a Pencey', ''),
  ('Capitolo 8 — Il treno per New York', ''),
  ('Capitolo 9 — L''Edmont Hotel', ''),
  ('Capitolo 10 — Sunny', ''),
  ('Capitolo 11 — La domenica', ''),
  ('Capitolo 12 — Il pattinaggio', ''),
  ('Capitolo 13 — La proposta', ''),
  ('Capitolo 14 — La visita di Sally', ''),
  ('Capitolo 15 — Incontro con nuns', ''),
  ('Capitolo 16 — Il museo', ''),
  ('Capitolo 17 — Phoebe', ''),
  ('Capitolo 18 — La cavalleria', ''),
  ('Capitolo 19 — Mr. Antolini', ''),
  ('Capitolo 20 — La depressione', ''),
  ('Capitolo 21 — La fuga', ''),
  ('Capitolo 22 — Il carosello', ''),
  ('Capitolo 23 — Il racconto', ''),
  ('Capitolo 24 — Il manicomio', ''),
  ('Analisi tematica', ''),
  ('Personaggi principali', ''),
  ('Simboli e metafore', '');
