import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import GroupSetup from './pages/GroupSetup'
import { RequireAuth, RequireGroup } from './routes/ProtectedRoute'

function TaskListPlaceholder() {
  return <h1>Lista de tarefas (próximo passo)</h1>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<SignUp />} />

          <Route element={<RequireAuth />}>
            <Route path="/grupo" element={<GroupSetup />} />
            <Route element={<RequireGroup />}>
              <Route path="/" element={<TaskListPlaceholder />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}