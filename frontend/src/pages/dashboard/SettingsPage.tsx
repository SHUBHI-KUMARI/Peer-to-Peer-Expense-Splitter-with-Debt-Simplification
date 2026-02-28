import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { User, Mail, Phone, Shield, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.username
    ? user.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Settings</div>
      </div>

      <div className="page-body">
        {/* tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border-light)', paddingBottom: 0 }}>
          {(['profile', 'account'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? 'var(--primary-600)' : 'var(--text-muted)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--primary-500)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="detail-layout" style={{ gridTemplateColumns: '1fr 300px' }}>
            <div>
              <div className="card">
                <div className="feed-title" style={{ marginBottom: 20 }}>Profile Information</div>
                <div className="input-wrapper" style={{ marginBottom: 16 }}>
                  <label className="input-label"><User size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Username</label>
                  <input className="input-field" value={user?.username ?? ''} readOnly />
                </div>
                <div className="input-wrapper" style={{ marginBottom: 16 }}>
                  <label className="input-label"><Mail size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Email</label>
                  <input className="input-field" value={user?.email ?? ''} readOnly />
                </div>
                <div className="input-wrapper" style={{ marginBottom: 16 }}>
                  <label className="input-label"><Phone size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Phone</label>
                  <input className="input-field" value={user?.phoneNumber ?? 'Not set'} readOnly />
                </div>
                <div className="input-wrapper">
                  <label className="input-label">Member Since</label>
                  <input className="input-field" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : ''} readOnly />
                </div>
              </div>
            </div>

            {/* right sidebar */}
            <div>
              <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
                <div className="user-avatar" style={{ width: 64, height: 64, fontSize: 22, margin: '0 auto 12px' }}>{initials}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{user?.username}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</div>
                <div style={{ marginTop: 16 }}>
                  <span className="badge badge-primary"><Shield size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />Active Account</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div style={{ maxWidth: 480 }}>
            <div className="card">
              <div className="feed-title" style={{ marginBottom: 20 }}>Account Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: '16px 20px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>Sign Out</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Sign out of your account on this device.</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ color: 'var(--danger-500)' }}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
