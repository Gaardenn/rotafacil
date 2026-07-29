import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

export function RequireAuth() {
    const { session, loading } = useAuth()
    if (loading) return <p>Carregando...</p>
    if (!session) return <Navigate to="/login" replace />
    return <Outlet />
}

export function RequireGroup() {
    const { activeGroup, loading } = useAuth()
    if (loading) return <p>Carregando...</p>
    if (!activeGroup) return <Navigate to="/grupo" replace />
    return <Outlet />
}