import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api'
const ADMIN_PASSWORD = 'gaby40'

const LABELS = {
  si: 'Confirmado',
  no: 'No asiste',
  talvez: 'Tal vez',
}

const PILL_CLASS = {
  si: 'pill-yes',
  no: 'pill-no',
  talvez: 'pill-maybe',
}

function LoginScreen({ onLogin }) {
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (pass === ADMIN_PASSWORD) {
      onLogin()
    } else {
      setError('Contraseña incorrecta')
      setPass('')
    }
  }

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '340px', textAlign: 'center', border: '1px solid #e0d8f0' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#2d1052', marginBottom: '0.5rem' }}>Panel Admin</h2>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Ingresá la contraseña para continuar</p>
        <div className="form-group" style={{ textAlign: 'left' }}>
          <label>Contraseña</label>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="••••••"
            style={{ background: '#f8f5f0', color: '#333', border: '1px solid #e0d8f0' }}
          />
        </div>
        {error && <p style={{ color: '#c62828', fontSize: '0.85rem', margin: '0.5rem 0' }}>{error}</p>}
        <button className="btn" style={{ marginTop: '1rem', width: '100%' }} onClick={handleLogin}>
          Entrar
        </button>
      </div>
    </div>
  )
}

export default function AdminPanel({ onBack }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [guests, setGuests] = useState([])
  const [stats, setStats] = useState({ total: 0, confirmed: 0, declined: 0, maybe: 0 })
  const [filter, setFilter] = useState('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authenticated) fetchData()
  }, [authenticated])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [gRes, sRes] = await Promise.all([
        fetch(`${API}/guests`),
        fetch(`${API}/stats`),
      ])
      setGuests(await gRes.json())
      setStats(await sRes.json())
    } catch {
      console.error('Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) return <LoginScreen onLogin={() => setAuthenticated(true)} />

  const filtered = filter === 'todos'
    ? guests
    : guests.filter((g) => g.attending === filter)

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h2 className="admin-title">Panel Administrador</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="admin-badge">Gaby · 40 años</span>
          <button className="nav-btn" onClick={onBack}>← Invitación</button>
          <button className="nav-btn" onClick={fetchData}>↻ Actualizar</button>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card"><div className="stat-num green">{stats.confirmed}</div><div className="stat-label">Confirmados</div></div>
        <div className="stat-card"><div className="stat-num amber">{stats.maybe}</div><div className="stat-label">Tal vez</div></div>
        <div className="stat-card"><div className="stat-num red">{stats.declined}</div><div className="stat-label">No asisten</div></div>
        <div className="stat-card"><div className="stat-num purple">{stats.total}</div><div className="stat-label">Total</div></div>
      </div>

      <div className="admin-nav">
        {[['todos', `Todos (${stats.total})`], ['si', 'Confirmados'], ['talvez', 'Tal vez'], ['no', 'No asisten']].map(([val, label]) => (
          <button key={val} className={`nav-btn ${filter === val ? 'active' : ''}`} onClick={() => setFilter(val)}>
            {label}
          </button>
        ))}
      </div>

      <div className="guest-list">
        <div className="guest-header">
          <span>Nombre</span><span>Teléfono</span><span>Fecha</span><span>Estado</span>
        </div>
        {loading ? (
          <div className="empty">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">Sin registros en esta categoría</div>
        ) : (
          filtered.map((g) => (
            <div key={g.id} className="guest-row">
              <span>{g.name}</span>
              <span className="muted">{g.phone || '—'}</span>
              <span className="muted">{g.date}</span>
              <span className={`pill ${PILL_CLASS[g.attending]}`}>{LABELS[g.attending]}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}