import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

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
        <form onSubmit={handleSubmit}>
            <h1>Entrar</h1>
            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {error && <p role="alert">{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <p>Não tem conta? <Link to="/cadastro">Criar conta</Link></p>
        </form>
    )
}