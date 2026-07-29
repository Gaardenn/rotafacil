import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import "../styles/Auth.css"

export default function Login() {
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        const { error } = await signIn(email, password)
        setLoading(false)
        if (error) {
            setError('E-mail ou senha incorretos.')
            return
        }
        navigate('/')
    }

    return (
        <div className="auth-screen">
            <div className="auth-header">
                <span className="auth-logo">🗺️</span>
                <h1>Bem-vindo de volta</h1>
                <p className="auth-subtitle">Entre para ver suas tarefas</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                <label className="field">
                    <span className="field-label">E-mail</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        required
                    />
                </label>

                <label className="field">
                    <span className="field-label">Senha</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </label>

                {error && <p className="field-error">{error}</p>}

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>

            <p className="auth-footer">
                Não tem conta? <Link to="/cadastro">Criar conta</Link>
            </p>
        </div>
    )
}