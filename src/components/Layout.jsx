import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import { TasksProvider } from '../context/TasksContext'

export default function Layout() {
    return (
        <TasksProvider>
            <div className="app-layout">
                <Outlet />
                <BottomNav />
            </div>
        </TasksProvider>
    )
}