import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import {
  LayoutDashboard,
  Users,
  Receipt,
  Zap,
  Settings,
  LogOut,
} from 'lucide-react'
import './DashboardLayout.css'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/groups', icon: Users, label: 'Groups' },
  { to: '/dashboard/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/dashboard/settle', icon: Zap, label: 'Settle Up' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">S</div>
          <div className="logo-text">
            Smart<span>Split</span>
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
