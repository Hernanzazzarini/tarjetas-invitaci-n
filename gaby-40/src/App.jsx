import { useState } from 'react'
import './App.css'
import AdminPanel from './AdminPanel'

const API = 'http://localhost:3001/api'

function InviteCard({ onConfirm }) {
  return (
    <div className="invite-page">
      <div className="ornament">✦ ✦ ✦</div>
      <p className="title-small">te invita a celebrar sus</p>
      <h1 className="title-name">Gaby</h1>
      <h2 className="title-40">40</h2>
      <p className="subtitle">años</p>
      <div className="divider" />

      <div className="info-box">
        <p className="info-label">Fecha</p>
        <p className="info-value">Sábado, 14 de Junio · 2025</p>
      </div>
      <div className="info-box">
        <p className="info-label">Lugar</p>
        <p className="info-value">Salón La Primavera · Córdoba</p>
      </div>
      <div className="info-box">
        <p className="info-label">Horario</p>
        <p className="info-value">21:00 hs</p>
      </div>

      <div className="ornament" style={{ marginTop: '0.5rem' }}>✦</div>
      <p className="confirm-hint">Por favor confirmá tu asistencia</p>
      <button className="btn" onClick={onConfirm}>Confirmar Asistencia</button>
    </div>
  )
}

function ConfirmForm({ onSuccess, onBack }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [attending, setAttending] = useState('si')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Por favor ingresá tu nombre'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), attending }),
      })
      if (!res.ok) throw new Error('Error al confirmar')
      onSuccess(name.trim())
    } catch {
      setError('Hubo un problema. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="invite-page">
      <p className="title-small">Confirmación de Asistencia</p>
      <h1 className="title-name" style={{ fontSize: '2rem' }}>Cumpleaños de Gaby</h1>
      <div className="divider" />

      <div className="form-group">
        <label>Tu nombre completo</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Juan García" />
      </div>
      <div className="form-group">
        <label>Teléfono (opcional)</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+54 351 ..." />
      </div>
      <div className="form-group">
        <label>¿Vas a asistir?</label>
        <select value={attending} onChange={e => setAttending(e.target.value)}>
          <option value="si">Sí, allá estaré 🎉</option>
          <option value="talvez">Tal vez</option>
          <option value="no">No podré ir</option>
        </select>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="btn-row">
        <button className="btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Enviando...' : 'Confirmar'}
        </button>
        <button className="btn btn-ghost" onClick={onBack}>← Volver</button>
      </div>
    </div>
  )
}

function SuccessScreen({ name, onBack }) {
  return (
    <div className="invite-page">
      <div className="success-icon">🎊</div>
      <div className="ornament">✦ ✦ ✦</div>
      <p className="title-small">¡Gracias, {name}!</p>
      <h1 className="title-name" style={{ fontSize: '2rem' }}>Tu confirmación</h1>
      <h1 className="title-name" style={{ fontSize: '2rem' }}>fue recibida</h1>
      <div className="divider" />
      <p className="confirm-hint">
        Nos vemos el <strong>14 de Junio</strong><br />en el Salón La Primavera
      </p>
      <button className="btn" style={{ marginTop: '1.5rem' }} onClick={onBack}>← Volver al inicio</button>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('invite') // invite | form | success | admin
  const [successName, setSuccessName] = useState('')

  if (view === 'admin') return <AdminPanel onBack={() => setView('invite')} />

  return (
    <div className="app">
      <div className="stars">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {view === 'invite' && <InviteCard onConfirm={() => setView('form')} />}
      {view === 'form' && (
        <ConfirmForm
          onSuccess={(name) => { setSuccessName(name); setView('success') }}
          onBack={() => setView('invite')}
        />
      )}
      {view === 'success' && <SuccessScreen name={successName} onBack={() => setView('invite')} />}

      {/* Botón oculto para el admin */}
      <button className="admin-trigger" onClick={() => setView('admin')}>⚙</button>
    </div>
  )
}
