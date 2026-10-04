-- O público passa a ler pela view public_magazines (sem user_id nem notes).
-- Esta política deixava visitantes lerem a TABELA inteira, incluindo user_id.
-- Os donos continuam lendo as próprias revistas pela política "Users can view their own magazines".
drop policy if exists "Public magazines are viewable by everyone" on public.magazines;

-- Para reverter:
-- create policy "Public magazines are viewable by everyone" on public.magazines
--   for select to anon, authenticated using (is_public = true);
