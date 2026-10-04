import { createClient } from '@supabase/supabase-js'

// import.meta.env lê as variáveis do arquivo .env.local.
// O prefixo VITE_ é obrigatório: só variáveis com ele chegam ao navegador.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error('Faltam VITE_SUPABASE_URL ou VITE_SUPABASE_PUBLISHABLE_KEY no .env.local')
}

// Um único cliente, usado pelo app inteiro para falar com o Supabase.
export const supabase = createClient(url, key)
