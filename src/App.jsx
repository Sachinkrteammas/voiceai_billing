import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Wallet from './pages/Wallet'
import Recharge from './pages/Recharge'
import Invoices from './pages/Invoices'
import InvoiceDetail from './pages/InvoiceDetail'
import Settings from './pages/Settings'

// Simple client-side auth flag for this frontend-only project.
// Replace with real session/auth handling when wiring up a backend.
function useAuth() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('voiceai_authed') === 'true')

  const login = () => {
    localStorage.setItem('voiceai_authed', 'true')
    setAuthed(true)
  }

  const logout = () => {
    localStorage.removeItem('voiceai_authed')
    setAuthed(false)
  }

  return { authed, login, logout }
}

function ProtectedRoute({ authed, children }) {
  return authed ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { authed, login } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={authed ? <Navigate to="/" replace /> : <Login onLogin={login} />} />
      <Route
        path="/"
        element={
          <ProtectedRoute authed={authed}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute authed={authed}>
            <Wallet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recharge"
        element={
          <ProtectedRoute authed={authed}>
            <Recharge />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoices"
        element={
          <ProtectedRoute authed={authed}>
            <Invoices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoices/:id"
        element={
          <ProtectedRoute authed={authed}>
            <InvoiceDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute authed={authed}>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
