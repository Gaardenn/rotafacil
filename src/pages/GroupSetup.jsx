import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import "../styles/GroupSetup.css"

export default function GroupSetup() {
    const { groups, createGroup, joinGroup, leaveGroup, selectGroup, signOut } = useAuth()
    const navigate = useNavigate()
    const [mode, setMode] = useState(groups.length > 0 ? null : 'create')
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

    function handleSelect(groupId) {
        selectGroup(groupId)
        navigate('/')
    }

    async function handleLeave(e, groupId) {
        e.stopPropagation()
        const confirmed = window.confirm('Tem certeza que quer sair desse grupo?')
        if (!confirmed) return
        await leaveGroup(groupId)
    }

    return (
        <div className="group-screen">
            <div className="group-header">
                <span className="group-emoji">🏡</span>
                <h1>{groups.length > 0 ? 'Seus grupos' : 'Vamos organizar tudo'}</h1>
                <p className="auth-subtitle">
                    {groups.length > 0 ? 'Escolha um grupo para continuar' : 'Crie um espaço só seu, ou entre no de alguém'}
                </p>
                <button className="group-logout-link" onClick={signOut}>Sair da conta</button>
            </div>

            {groups.length > 0 && (
                <ul className="group-list">
                    {groups.map((g) => (
                        <li key={g.id} className="group-list-item" onClick={() => handleSelect(g.id)}>
                            <span className="group-list-name">{g.name}</span>
                            <button
                                className="group-leave-btn"
                                onClick={(e) => handleLeave(e, g.id)}
                                aria-label={`Sair do grupo ${g.name}`}
                            >
                                Sair
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {mode === null ? (
                <div className="group-tabs">
                    <button className="group-tab" onClick={() => setMode('create')}>
                        + Criar novo grupo
                    </button>
                    <button className="group-tab" onClick={() => setMode('join')}>
                        Entrar com código
                    </button>
                </div>
            ) : (
                <>
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
                            Entrar com código
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
                </>
            )}
        </div>
    )
}