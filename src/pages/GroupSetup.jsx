import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import "../styles/GroupSetup.css"

export default function GroupSetup() {
    const { createGroup, joinGroup } = useAuth()
    const navigate = useNavigate()
    const [mode, setMode] = useState('create')
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        const { error } = mode === 'create' ? await createGroup(name) : await joinGroup(code)
        setLoading(false)
        if (error) {
            setError(error.message)
            return
        }
        navigate('/')
    }

    return (
        <div className="group-screen">
            <div className="group-header">
                <span className="group-emoji">🏡</span>
                <h1>Vamos organizar tudo</h1>
                <p className="auth-subtitle">Crie um espaço só seu, ou entre no de alguém</p>
            </div>

            <div className="group-tabs">
                <button
                    className={`group-tab ${mode === 'create' ? 'active' : ''}`}
                    onClick={() => setMode('create')}
                >
                    Criar grupo
                </button>
                <button
                    className={`group-tab ${mode === 'join' ? 'active' : ''}`}
                    onClick={() => setMode('join')}
                >
                    Já tenho código
                </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {mode === 'create' ? (
                    <label className="field">
                        <span className="field-label">Nome do grupo</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Casa da família"
                            required
                        />
                    </label>
                ) : (
                    <label className="field">
                        <span className="field-label">Código de convite</span>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Ex: A1B2C3"
                            className="field-code"
                            required
                        />
                    </label>
                )}

                {error && <p className="field-error">{error}</p>}

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Aguarde...' : mode === 'create' ? 'Criar grupo' : 'Entrar no grupo'}
                </button>
            </form>
        </div>
    )
}