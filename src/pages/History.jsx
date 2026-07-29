import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { fetchCompletedTasks } from '../lib/taskService'
import "../styles/History.css"

export default function History() {
    const { activeGroup: group } = useAuth()
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!group) return
        loadHistory()
    }, [group])

    async function loadHistory() {
        setLoading(true)

        const { data, error } = await fetchCompletedTasks(group.id)
        if (!error) {
            setTasks(data)
        }

        setLoading(false)
    }

    if (loading) return <p>Carregando histórico...</p>

    return (
        <div className="history-screen">
            <header className="history-header">
                <h1>Histórico</h1>
                <p className="auth-subtitle">O que já foi feito</p>
            </header>

            {loading ? (
                <p className="task-empty">Carregando...</p>
            ) : tasks.length === 0 ? (
                <div className="task-empty-state">
                    <span className="task-empty-emoji">📋</span>
                    <p>Nenhuma tarefa concluída ainda.</p>
                </div>
            ) : (
                <ul className="history-list">
                    {tasks.map((task) => (
                        <li key={task.id} className="history-item">
                            <div className="history-check">✓</div>
                            <div className="history-content">
                                <p className="history-title">{task.title}</p>
                                <p className="history-meta">
                                    {task.completedByName} · {new Date(task.completed_at).toLocaleString('pt-BR', {
                                        day: '2-digit',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}