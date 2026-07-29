import "../styles/BottomNav.css"
import { NavLink } from 'react-router-dom'

export default function BottomNav() {
    return (
        <nav className="bottom-nav">
            <NavLink to="/" end className="bottom-nav-item">
                <span className="bottom-nav-icon">✅</span>
                <span>Tarefas</span>
            </NavLink>
            <NavLink to="/historico" end className="bottom-nav-item">
                <span className="bottom-nav-icon">🕓</span>
                <span>Histórico</span>
            </NavLink>
        </nav>
    )
}