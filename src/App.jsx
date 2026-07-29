import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import GroupSetup from './pages/GroupSetup'
import { RequireAuth, RequireGroup } from './routes/ProtectedRoute'
import TaskList from './pages/TaskList'
import History from './pages/History'
import Layout from './components/Layout'

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
              <Route element={<Layout />}>
                <Route path="/" element={<TaskList />} />
                <Route path="/historico" element={<History />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}