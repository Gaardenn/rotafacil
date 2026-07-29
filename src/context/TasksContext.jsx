import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
import { useTasks } from '../hooks/useTasks'

const TasksContext = createContext(null)

export function TasksProvider({ children }) {
    const { activeGroup: group, session } = useAuth()
    const tasksState = useTasks(group, session?.user?.id)

    return (
        <TasksContext.Provider value={tasksState}>
            {children}
        </TasksContext.Provider>
    )
}

export function useTasksContext() {
    return useContext(TasksContext);
}