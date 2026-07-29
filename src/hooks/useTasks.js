import { useState, useCallback, useEffect } from 'react'
import { fetchPendingTasks, subscribeToTaskChanges, addTask as addTaskRequest, completeTask as completeTaskRequest } from '../lib/taskService'

export function useTasks(group, userId) {
    const [pendingTasks, setPendingTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadTasks = useCallback(async () => {
        if (!group) return
        const { data, error } = await fetchPendingTasks(group.id)
        if (!error) setPendingTasks(data)
        setLoading(false)
    }, [group])

    useEffect(() => {
        if (!group) return
        setLoading(true)
        loadTasks()

        const unsubscribe = subscribeToTaskChanges(group.id, (payload) => {
            if (payload.eventType === 'INSERT') {
                setPendingTasks((prev) => [payload.new, ...prev])
            }
            if (payload.eventType === 'UPDATE' && payload.new.completed) {
                setPendingTasks((prev) => prev.filter((t) => t.id !== payload.new.id))
                setCompletedTasks((prev) =>
                    prev.some((t) => t.id === payload.new.id) ? prev : [payload.new, ...prev]
                )
            }
        })

        return unsubscribe
    }, [group, loadTasks])

    async function addTask(title) {
        setError('')
        const { error } = await addTaskRequest({ title, groupId: group.id, userId })
        if (error) setError(error.message)
        return { error }
    }

    async function completeTask(taskId) {
        const task = pendingTasks.find((t) => t.id === taskId)
        if (!task) return

        setPendingTasks((prev) => prev.filter((t) => t.id !== taskId))
        setCompletedTasks((prev) => [{ ...task, completed: true }, ...prev])

        await completeTaskRequest({ taskId, userId })
    }

    function clearCompleted() {
        setCompletedTasks([])
    }

    return { pendingTasks, completedTasks, loading, error, addTask, completeTask, clearCompleted }
}