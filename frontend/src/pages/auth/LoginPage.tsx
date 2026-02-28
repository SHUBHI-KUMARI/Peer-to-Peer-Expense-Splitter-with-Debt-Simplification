import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout, { GoogleIcon } from './AuthLayout'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email address'
    if (!formData.password) newErrors.password = 'Password is required'
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
    alert('Login submitted!')
  }

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>

        <div className="auth-form-title">Welcome back</div>
        <div className="auth-form-sub">Sign in to your SmartSplit account</div>

        {errors._global && <div className="auth-error">{errors._global}</div>}

        <div className="form-fields">

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
              autoComplete="current-password"
            />
            {errors.password && <span style={{ fontSize: 12, color: 'var(--danger-500)' }}>{errors.password}</span>}
          </div>

          <div className="forgot-link-row">
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

        </div>

        <button type="submit" className="btn-primary-full" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
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
          Don&apos;t have an account? <Link to="/signup">Create one free</Link>
        </div>

      </form>
    </AuthLayout>
  )
}
