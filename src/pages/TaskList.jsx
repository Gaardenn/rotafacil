import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import TaskItem from '../components/TaskItem'
import { Link } from 'react-router-dom'
import "../styles/TaskList.css"

export default function TaskList() {
    const { group, session, signOut } = useAuth()
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
        <div className="task-screen">
            <header className="task-header">
                <div>
                    <p className="task-eyebrow">Seu grupo</p>
                    <h1>{group.name}</h1>
                </div>
                <button className="task-avatar" onClick={signOut} aria-label="Sair da conta">
                    {group.name.charAt(0).toUpperCase()}
                </button>
            </header>

            <form className="task-add-form" onSubmit={handleAdd}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="O que precisa ser feito?"
                    className="task-add-input"
                />
                <button type="submit" className="task-add-btn" aria-label="Adicionar tarefa">
                    +
                </button>
            </form>

            {error && <p className="field-error">{error}</p>}

            {loading ? (
                <p className="task-empty">Carregando tarefas...</p>
            ) : tasks.length === 0 ? (
                <div className="task-empty-state">
                    <span className="task-empty-emoji">🌿</span>
                    <p>Nenhuma tarefa pendente.</p>
                    <p className="task-empty-sub">Adicione a primeira acima.</p>
                </div>
            ) : (
                <ul className="task-list">
                    {tasks.map((task) => (
                        <TaskItem key={task.id} task={task} onComplete={handleComplete} />
                    ))}
                </ul>
            )}
        </div>
    )
}