-- View pública: só as colunas que um visitante precisa ver.
-- Deixa de fora user_id (identificador interno da conta) e notes (anotações privadas).
-- Roda com os direitos do dono da view (padrão), por isso filtra is_public aqui dentro.
create or replace view public.public_magazines as
select id, title, issue, year, month, condition, cover_model, cover_image_url, acquired, is_public, created_at
from public.magazines
where is_public = true;

grant select on public.public_magazines to anon, authenticated;
