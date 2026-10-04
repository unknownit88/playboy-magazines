import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false) // evita clicar duas vezes enquanto espera

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage(null)

    // As duas funções devolvem { error }. Se error for null, deu certo.
    const { error } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    if (error) setMessage(error.message)
    // Se deu certo não precisamos fazer nada: o useSession percebe sozinho
    // que há uma sessão nova e a tela troca.
    setBusy(false)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h2>

      <label>
        Email
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label>
        Senha (mínimo 6 caracteres)
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>

      {message && <p className="form__error">{message}</p>}

      <button type="submit" disabled={busy}>
        {busy ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
      </button>

      <button type="button" className="form__link" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? 'Não tenho conta' : 'Já tenho conta'}
      </button>
    </form>
  )
}
