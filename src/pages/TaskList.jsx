import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { useTasksContext } from '../context/TasksContext'
import TaskItem from '../components/TaskItem'
import { useNavigate } from 'react-router-dom'
import "../styles/TaskList.css"

export default function TaskList() {
    const { activeGroup: group } = useAuth()
    const [title, setTitle] = useState('')
    const navigate = useNavigate()
    const { pendingTasks, completedTasks, loading, error, addTask, completeTask, clearCompleted } =
        useTasksContext()

    async function handleAdd(e) {
        e.preventDefault()
        if (!title.trim()) return
        const { error } = await addTask(title.trim())
        if (!error) setTitle('')
    }

    if (loading) return <p>Carregando tarefas...</p>

    return (
        <div className="task-screen">
            <header className="task-header">
                <div>
                    <p className="task-eyebrow">Seu grupo</p>
                    <h1>{group.name}</h1>
                </div>
                <button className="task-avatar" onClick={() => navigate('/grupo')} aria-label="Trocar de grupo ou sair">
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
            ) : pendingTasks.length === 0 && completedTasks.length === 0 ? (
                <div className="task-empty-state">
                    <span className="task-empty-emoji">🌿</span>
                    <p>Nenhuma tarefa pendente.</p>
                    <p className="task-empty-sub">Adicione a primeira acima.</p>
                </div>
            ) : (
                <>
                    <ul className="task-list">
                        {pendingTasks.map((task) => (
                            <TaskItem key={task.id} task={task} onComplete={completeTask} />
                        ))}
                    </ul>

                    {completedTasks.length > 0 && (
                        <div className="completed-section">
                            <div className="completed-section-header">
                                <span>Concluídas</span>
                                <button className="clear-btn" onClick={clearCompleted}>
                                    Limpar concluídas
                                </button>
                            </div>
                            <ul className="task-list">
                                {completedTasks.map((task) => (
                                    <TaskItem key={task.id} task={task} completed />
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}