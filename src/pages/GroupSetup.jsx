import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

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
        <div>
            <h1>Vamos organizar suas tarefas</h1>
            <div>
                <button onClick={() => setMode('create')} disabled={mode === 'create'}>
                    Criar grupo
                </button>
                <button onClick={() => setMode('join')} disabled={mode === 'join'}>
                    Entrar com código
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {mode === 'create' ? (
                    <input
                        type="text"
                        placeholder="Nome do grupo (ex: Casa da família)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                ) : (
                    <input
                        type="text"
                        placeholder="Código de convite"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                )}
                {error && <p role="alert">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Aguarde...' : mode === 'create' ? 'Criar' : 'Entrar'}
                </button>
            </form>
        </div>
    )
}