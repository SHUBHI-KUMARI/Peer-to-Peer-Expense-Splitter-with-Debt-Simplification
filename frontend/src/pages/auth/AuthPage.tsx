import { useState } from 'react'
import './AuthPage.css'

type Mode = 'login' | 'signup'

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
  </svg>
)

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (mode === 'signup') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    }
    if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email address'
    if (!formData.password) newErrors.password = newErrors.password ?? 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    // TODO: wire up to backend API
    await new Promise(r => setTimeout(r, 800))
    setSubmitting(false)
    alert(mode === 'login' ? 'Login submitted!' : 'Account created!')
  }

  const switchMode = () => {
    setMode(m => (m === 'login' ? 'signup' : 'login'))
    setErrors({})
    setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-screen-card">
        <div className="auth-screen">

          {/* ── Left branding panel ── */}
          <div className="auth-left">
            <div className="sidebar-logo">
              <div className="logo-icon">S</div>
              <div className="logo-text">Smart<span>Split</span></div>
            </div>

            <div>
              <div className="auth-tagline">
                Split expenses.<br /><span>Not friendships.</span>
              </div>
              <div className="auth-features">
                <div className="auth-feature"><span className="dot" />Graph-based minimum transaction algorithm</div>
                <div className="auth-feature"><span className="dot" />Real-time balance tracking across groups</div>
                <div className="auth-feature"><span className="dot" />One-tap settle up with full history</div>
                <div className="auth-feature"><span className="dot" />Works for any group size, any currency</div>
              </div>
            </div>

            <div className="auth-copyright">© 2025 SpliX. All rights reserved.</div>
          </div>

          {/* ── Right form panel ── */}
          <div className="auth-right">
            <form className="auth-form" onSubmit={handleSubmit} noValidate>

              {mode === 'login' ? (
                <>
                  <div className="auth-form-title">Welcome back</div>
                  <div className="auth-form-sub">Sign in to your SpliX account</div>
                </>
              ) : (
                <>
                  <div className="auth-form-title">Create account</div>
                  <div className="auth-form-sub">Start splitting smarter — it&apos;s free</div>
                </>
              )}

              {errors._global && (
                <div className="auth-error">{errors._global}</div>
              )}

              <div className="form-fields">

                {/* Signup-only: name row */}
                {mode === 'signup' && (
                  <div className="name-row">
                    <div className="input-wrapper">
                      <label className="input-label" htmlFor="firstName">First name</label>
                      <input
                        id="firstName"
                        name="firstName"
                        className={`input-field${errors.firstName ? ' error' : ''}`}
                        type="text"
                        placeholder="Jane"
                        value={formData.firstName}
                        onChange={handleChange}
                        autoComplete="given-name"
                      />
                      {errors.firstName && <span style={{ fontSize: 12, color: 'var(--danger-500)' }}>{errors.firstName}</span>}
                    </div>
                    <div className="input-wrapper">
                      <label className="input-label" htmlFor="lastName">Last name</label>
                      <input
                        id="lastName"
                        name="lastName"
                        className={`input-field${errors.lastName ? ' error' : ''}`}
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        autoComplete="family-name"
                      />
                      {errors.lastName && <span style={{ fontSize: 12, color: 'var(--danger-500)' }}>{errors.lastName}</span>}
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="input-wrapper">
                  <label className="input-label" htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    className={`input-field${errors.email ? ' error' : ''}`}
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  {errors.email && <span style={{ fontSize: 12, color: 'var(--danger-500)' }}>{errors.email}</span>}
                </div>

                {/* Password */}
                <div className="input-wrapper">
                  <label className="input-label" htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    className={`input-field${errors.password ? ' error' : ''}`}
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  {errors.password && <span style={{ fontSize: 12, color: 'var(--danger-500)' }}>{errors.password}</span>}
                </div>

                {/* Signup-only: confirm password */}
                {mode === 'signup' && (
                  <div className="input-wrapper">
                    <label className="input-label" htmlFor="confirmPassword">Confirm password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`input-field${errors.confirmPassword ? ' error' : ''}`}
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && <span style={{ fontSize: 12, color: 'var(--danger-500)' }}>{errors.confirmPassword}</span>}
                  </div>
                )}

                {/* Forgot password — login only */}
                {mode === 'login' && (
                  <div className="forgot-link-row">
                    <a href="#" className="forgot-link">Forgot password?</a>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary-full"
                disabled={submitting}
              >
                {submitting
                  ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
                  : (mode === 'login' ? 'Sign in' : 'Create account')}
              </button>

              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">or continue with</span>
                <div className="divider-line" />
              </div>

              <button type="button" className="google-btn">
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="auth-footer-text">
                {mode === 'login' ? (
                  <>Don&apos;t have an account? <a onClick={switchMode}>Create one free</a></>
                ) : (
                  <>Already have an account? <a onClick={switchMode}>Sign in</a></>
                )}
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
