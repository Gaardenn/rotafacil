import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import "../styles/Auth.css"
import { translateError } from '../lib/errorMessages'

export default function SignUp() {
    const { signUp } = useAuth()
    const navigate = useNavigate()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        const { error } = await signUp(email, password, fullName)
        setLoading(false)
        if (error) {
            setError(translateError(error))
            return
        }
        navigate('/grupo')
    }

    return (
        <div className="auth-screen">
            <div className="auth-header">
                <span className="auth-logo">✨</span>
                <h1>Criar conta</h1>
                <p className="auth-subtitle">Leva menos de um minuto</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                <label className="field">
                    <span className="field-label">Seu nome</span>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Como podemos te chamar?"
                        required
                    />
                </label>

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
                        placeholder="Minimo 6 caracteres"
                        minLength={6}
                        required
                    />
                </label>

                {error && <p className="field-error">{error}</p>}

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Criando...' : 'Criar conta'}
                </button>
            </form>


            <p className="auth-footer">
                Já tem conta? <Link to="/login">Entrar</Link>
            </p>
        </div>
    )
}