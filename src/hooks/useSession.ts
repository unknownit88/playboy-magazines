import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// Um "hook customizado": uma função que começa com "use" e reaproveita lógica.
// Quem chamar useSession() recebe a sessão atual e é redesenhado quando ela muda.
export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true) // true enquanto ainda não sabemos se há login

  useEffect(() => {
    // 1. Pergunta uma vez: já existe uma sessão salva no navegador?
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // 2. Fica "escutando": avisa sempre que alguém entrar ou sair.
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    // 3. Limpeza: ao sair da tela, para de escutar.
    return () => data.subscription.unsubscribe()
  }, []) // [] = roda só uma vez, quando o componente aparece

  return { session, loading }
}
