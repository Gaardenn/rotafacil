import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import TaskItem from '../components/TaskItem'
import { Link } from 'react-router-dom'

export default function TaskList() {
    const { group, session } = useAuth()
    const [tasks, setTasks] = useState([])
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!group) return
        loadTasks()

        const channel = supabase
            .channel('tasks-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tasks', filter: `group_id=eq.${group.id}` },
                () => loadTasks()
            )
            .subscribe()
        
        return () => supabase.removeChannel(channel)
    }, [group])

    async function loadTasks() {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('group_id', group.id)
            .eq('completed', false)
            .order('created_at', { ascending: false })

        if (!error) setTasks(data)
        setLoading(false)
    }

    async function handleAdd(e) {
        e.preventDefault()
        if (!title.trim()) return
        setError('')

        const { error } = await supabase.from('tasks').insert({
            title: title.trim(),
            group_id: group.id,
            created_by: session.user.id,
        })

        if (error) {
            setError(error.message)
            return
        }
        setTitle('')
    }

    async function handleComplete(taskId) {
        await supabase
            .from('tasks')
            .update({
                completed: true,
                completed_by: session.user.id,
                completed_at: new Date().toISOString(),
            })
            .eq('id', taskId)
    }

    if (loading) return <p>Carregando tarefas...</p>

    return (
        <div>
            <h1>{group.name}</h1>

            <form onSubmit={handleAdd}>
                <input
                    type="text"
                    placeholder="Nova tarefa"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button type="submit">Adicionar</button>
            </form>
            {error && <p role="alert">{error}</p>}

            {tasks.length === 0 ? (
                <p>Nenhuma tarefa pendente.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <TaskItem key={task.id} task={task} onComplete={handleComplete} />
                    ))}
                </ul>
            )}

            <Link to="/historico">historico</Link>
        </div>
    )
}