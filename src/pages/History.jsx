import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

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
        <div>
            <h1>Histórico</h1>
            {tasks.length === 0 ? (
                <p>Nenhuma tarefa concluída ainda.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            {task.title} - concluída por {task.completedByName} em{' '}
                            {new Date(task.completed_at).toLocaleString('pt-BR')}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}