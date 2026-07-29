import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import "../styles/History.css"

export default function History() {
    const { group } = useAuth()
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!group) return
        loadHistory()
    }, [group])

    async function loadHistory() {
        const { data: taskData, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('group_id', group.id)
            .eq('completed', true)
            .order('completed_at', { ascending: false })

        if (error) {
            setLoading(false)
            return
        }

        const userIds = [...new Set(taskData.map((t) => t.completed_by).filter(Boolean))]

        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds)

        const nameById = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.full_name]))

        const withNames = taskData.map((t) => ({
            ...t,
            completedByName: nameById[t.completed_by] ?? 'alguém',
        }))

        setTasks(withNames)
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