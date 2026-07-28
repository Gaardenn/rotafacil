export default function TaskItem({ task, onComplete }) {
    return (
        <li>
            <label>
                <input
                    type="checkbox"
                    checked={false}
                    onChange={() => onComplete(task.id)}
                />
                {task.title}
            </label>
        </li>
    )
}