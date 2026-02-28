import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout, { GoogleIcon } from './AuthLayout'
import { useAuth } from '../../context/useAuth'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
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
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email address'
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setErrors({})
    try {
      const username = `${formData.firstName.trim()} ${formData.lastName.trim()}`
      await signup({
        username,
        email: formData.email,
        password: formData.password,
        ...(formData.phoneNumber.trim() ? { phoneNumber: formData.phoneNumber.trim() } : {}),
      })
      navigate('/dashboard')
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      setErrors({ _global: apiErr?.message || 'Something went wrong' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>

        <div className="auth-form-title">Create account</div>
        <div className="auth-form-sub">Start splitting smarter — it&apos;s free</div>

        {errors._global && <div className="auth-error">{errors._global}</div>}

        <div className="form-fields">

          {/* Name row */}
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

          {/* Phone number (optional) */}
          <div className="input-wrapper">
            <label className="input-label" htmlFor="phoneNumber">Phone number <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span></label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              className={`input-field${errors.phoneNumber ? ' error' : ''}`}
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phoneNumber}
              onChange={handleChange}
              autoComplete="tel"
            />
            {errors.phoneNumber && <span style={{ fontSize: 12, color: 'var(--danger-500)' }}>{errors.phoneNumber}</span>}
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
              autoComplete="new-password"
            />
            {errors.password && <span style={{ fontSize: 12, color: 'var(--danger-500)' }}>{errors.password}</span>}
          </div>

          {/* Confirm password */}
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

        </div>

        <button type="submit" className="btn-primary-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
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
          Already have an account? <Link to="/login">Sign in</Link>
        </div>

      </form>
    </AuthLayout>
  )
}
