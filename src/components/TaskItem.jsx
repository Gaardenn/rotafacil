import "../styles/TaskItem.css"
import { useState } from 'react'

export default function TaskItem({ task, onComplete, completed = false }) {
    const [isCompleting, setIsCompleting] = useState(false)

    function handleClick() {
        if (completed || isCompleting) return
        setIsCompleting(true)
        setTimeout(() => {
            onComplete(task.id)
        }, 280)
    }

    return (
        <li className={`task-item ${isCompleting ? 'is-completing' : ''} ${completed ? 'is-done-item' : ''}`}>
            <button
                className="task-checkbox"
                onClick={handleClick}
                aria-label={completed ? `${task.title} concluída` : `Marcar "${task.title}" como concluída`}
                disabled={completed}
            >
                <svg viewBox="0 0 24 24" className="task-checkbox-icon">
                    <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <span className={`task-item-title ${completed ? 'is-done' : ''}`}>{task.title}</span>
        </li>
    )
}