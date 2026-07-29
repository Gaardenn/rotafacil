import "../styles/TaskItem.css"
import { useState } from 'react'

export default function TaskItem({ task, onComplete }) {
    const [isCompleting, setIsCompleting] = useState(false)

    function handleClick() {
        if (isCompleting) return
        setIsCompleting(true)
        setTimeout(() => {
            onComplete(task.id)
        }, 280)
    }

    return (
        <li className={`task-item ${isCompleting ? 'is-completing' : ''}`}>
            <button
                className="task-checkbox"
                onClick={handleClick}
                aria-label={`Marcar "${task.title}" como concluída`}
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
            <span className="task-item-title">{task.title}</span>
        </li>
    )
}