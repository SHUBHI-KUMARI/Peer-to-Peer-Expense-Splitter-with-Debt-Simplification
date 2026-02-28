import { useAuth } from '../../context/useAuth'
import { useNavigate } from 'react-router-dom'
import './DashboardPage.css'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-root">
      <nav className="dashboard-nav">
        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">S</div>
          <span className="dashboard-logo-text">Smart<span>Split</span></span>
        </div>
        <div className="dashboard-nav-right">
          <span className="dashboard-greeting">Hey, {user?.username?.split(' ')[0] ?? 'there'} 👋</span>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-welcome-card">
          <h1>Welcome to SmartSplit</h1>
          <p>You're signed in as <strong>{user?.email}</strong></p>
          <div className="dashboard-info-grid">
            <div className="dashboard-info-item">
              <span className="dashboard-info-label">Username</span>
              <span className="dashboard-info-value">{user?.username}</span>
            </div>
            <div className="dashboard-info-item">
              <span className="dashboard-info-label">Email</span>
              <span className="dashboard-info-value">{user?.email}</span>
            </div>
            {user?.phoneNumber && (
              <div className="dashboard-info-item">
                <span className="dashboard-info-label">Phone</span>
                <span className="dashboard-info-value">{user.phoneNumber}</span>
              </div>
            )}
          </div>
          <p style={{ marginTop: '2rem', opacity: 0.6, fontSize: '0.9rem' }}>
            Dashboard features coming soon — groups, expenses, balances and more.
          </p>
        </div>
      </main>
    </div>
  )
}
