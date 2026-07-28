import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

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
            setError(error.message)
            return
        }
        navigate('/grupo')
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Criar conta</h1>
            <input
                type="text"
                placeholder="Seu nome"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
            />
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
                minLength={6}
                required
            />
            {error && <p role="alert">{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar conta'}
            </button>
            <p>Já tem conta? <Link to="/login">Entrar</Link></p>
        </form>
    )
}