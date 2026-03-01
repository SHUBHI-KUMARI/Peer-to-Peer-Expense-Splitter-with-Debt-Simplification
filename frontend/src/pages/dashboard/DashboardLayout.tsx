import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import {
  LayoutDashboard,
  Users,
  Receipt,
  Zap,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import './DashboardLayout.css'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/groups', icon: Users, label: 'Groups' },
  { to: '/dashboard/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/dashboard/settle', icon: Zap, label: 'Settle Up' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /* Close sidebar on route change (mobile) */
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const initials = user?.username
    ? user.username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      {/* Mobile header */}
      <header className="mobile-header">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="mobile-logo">
          <div className="logo-icon">S</div>
          <div className="logo-text">
            Spli<span>X</span>
          </div>
        </div>
        <div className="mobile-avatar">{initials}</div>
      </header>

      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">S</div>
          <div className="logo-text">
            Spli<span>X</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-item${isActive ? ' active' : ''}`
              }
            >
              <span className="nav-icon">
                <item.icon size={18} />
              </span>
              {item.label}
            </NavLink>
          ))}

          <div className="nav-spacer" />

          <NavLink to="/dashboard/settings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <span className="nav-icon">
              <Settings size={18} />
            </span>
            Settings
          </NavLink>

          <button
            className="nav-item"
            onClick={handleLogout}
            style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
          >
            <span className="nav-icon">
              <LogOut size={18} />
            </span>
            Logout
          </button>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.username ?? 'User'}</div>
            <div className="user-email">{user?.email ?? ''}</div>
          </div>
        </div>
      </aside>

      {/* Main content area — pages render via Outlet */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}
