import type { ReactNode } from 'react'
import './AuthPage.css'

export const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
  </svg>
)

export default function AuthLayout({ children }: { children: ReactNode }) {
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
            {children}
          </div>

        </div>
      </div>
    </div>
  )
}
