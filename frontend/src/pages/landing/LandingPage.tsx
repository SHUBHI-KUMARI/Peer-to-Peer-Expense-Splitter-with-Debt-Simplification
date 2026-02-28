import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Play, Users, Receipt, Zap, CheckCircle,
  Bell, BarChart3, Globe, Link2, Scale, TrendingUp,
  Twitter, Linkedin, Github, Mail, Plus, Minus,
  LayoutDashboard, Settings, Plane, Home, Utensils, PartyPopper,
  ChevronRight, Star,
} from 'lucide-react'
import './LandingPage.css'

/* ─── Small helper ─── */
const Avatar = ({
  label, bg, size = 28,
}: { label: string; bg: string; size?: number }) => (
  <div
    className="lp-act-avatar"
    style={{ background: bg, width: size, height: size, fontSize: size * 0.38 }}
  >
    {label}
  </div>
)

/* ─── FAQ single item ─── */
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="lp-faq-item" onClick={() => setOpen(o => !o)}>
      <div className="lp-faq-q">
        {q}
        <span className={`lp-faq-toggle${open ? ' open' : ''}`}>
          {open ? <Minus size={12} /> : <Plus size={12} />}
        </span>
      </div>
      <div className={`lp-faq-a${open ? ' open' : ''}`}>{a}</div>
    </div>
  )
}

/* ── Star rating row ── */
const Stars = ({ n = 5 }: { n?: number }) => (
  <div className="lp-tcard-stars">
    {Array.from({ length: n }).map((_, i) => (
      <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
    ))}
  </div>
)

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing-root">

      {/* ════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════ */}
      <nav className={`lp-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="lp-nav-logo" onClick={() => scrollTo('hero')} style={{ cursor: 'pointer' }}>
          <div className="lp-nav-logo-icon">S</div>
          <div className="lp-nav-logo-text">Spli<span style={{ fontWeight: 900 }}>X</span></div>
        </div>

        <div className="lp-nav-links">
          {(['features', 'how', 'pricing', 'faq'] as const).map(id => (
            <button key={id} className="lp-nav-link" onClick={() => scrollTo(id)}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>

        <div className="lp-nav-actions">
          <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
          <button className="lp-btn-primary" onClick={() => navigate('/signup')}>
            Get started free <ChevronRight size={14} />
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="lp-hero" id="hero">
        <div className="lp-hero-grid" />
        <div className="lp-hero-orb lp-hero-orb-1" />
        <div className="lp-hero-orb lp-hero-orb-2" />
        <div className="lp-hero-orb lp-hero-orb-3" />

        <div className="lp-hero-badge anim-fade-up">
          <span className="lp-badge-dot" />
          <span>Graph-based minimum cash flow algorithm</span>
        </div>

        <h1 className="lp-hero-headline anim-fade-up d1">
          Split expenses.<br />
          <span className="accent-green">Not friendships.</span>
        </h1>

        <p className="lp-hero-sub anim-fade-up d2">
          SmartSplit minimizes the transactions needed to settle group debts using intelligent graph
          optimization. Fewer payments, zero awkwardness.
        </p>

        <div className="lp-hero-cta anim-fade-up d3">
          <button className="lp-btn-hero-primary" onClick={() => navigate('/signup')}>
            Start splitting free <ArrowRight size={16} />
          </button>
          <button className="lp-btn-hero-ghost" onClick={() => scrollTo('how')}>
            <Play size={16} fill="currentColor" /> See how it works
          </button>
        </div>

        <div className="lp-hero-social-proof anim-fade-up d4">
          <div className="lp-hero-avatars">
            {[
              { l: 'R', bg: 'linear-gradient(135deg,#3B6FD4,#059669)' },
              { l: 'P', bg: 'linear-gradient(135deg,#F59E0B,#D97706)' },
              { l: 'A', bg: 'linear-gradient(135deg,#F98080,#E02424)' },
              { l: 'S', bg: 'linear-gradient(135deg,#34D399,#047857)' },
              { l: '+', bg: 'linear-gradient(135deg,#6B96E8,#2154B3)' },
            ].map(({ l, bg }, i) => (
              <div key={i} className="lp-h-avatar" style={{ background: bg }}>{l}</div>
            ))}
          </div>
          <div className="lp-hero-stars">★★★★★</div>
          <span>Loved by <strong style={{ color: 'rgba(255,255,255,0.65)' }}>12,000+</strong> users across 80+ countries</span>
        </div>

        {/* App preview mock */}
        <div className="lp-hero-preview" style={{ position: 'relative' }}>
          <div className="lp-preview-browser">
            <div className="lp-preview-bar">
              <div className="lp-browser-dots">
                <div className="lp-browser-dot" style={{ background: '#FF5F57' }} />
                <div className="lp-browser-dot" style={{ background: '#FFBD2E' }} />
                <div className="lp-browser-dot" style={{ background: '#28CA41' }} />
              </div>
              <div className="lp-preview-url">app.smartsplit.io/dashboard</div>
            </div>

            <div className="lp-preview-shell">
              {/* Sidebar */}
              <div className="lp-preview-sidebar">
                <div className="lp-preview-sidebar-logo">
                  <div className="lp-ps-logo-icon">S</div>
                  <div className="lp-ps-logo-text">Smart<span>Split</span></div>
                </div>
                <div className="lp-preview-nav">
                  {[
                    { label: 'Dashboard', icon: <LayoutDashboard size={12} />, active: true },
                    { label: 'Groups',    icon: <Users      size={12} /> },
                    { label: 'Expenses',  icon: <Receipt    size={12} /> },
                    { label: 'Settle Up', icon: <Zap        size={12} /> },
                    { label: 'Analytics', icon: <BarChart3  size={12} /> },
                    { label: 'Settings',  icon: <Settings   size={12} /> },
                  ].map(({ label, icon, active }) => (
                    <div key={label} className={`lp-p-nav-item${active ? ' active' : ''}`}>
                      {icon} {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content */}
              <div className="lp-preview-main">
                <div className="lp-preview-topbar">
                  <div className="lp-preview-topbar-title">Dashboard</div>
                  <button className="lp-p-add-btn">+ Add Expense</button>
                </div>
                <div className="lp-preview-body">
                  <div className="lp-p-stats">
                    <div className="lp-p-stat owe"><div className="lp-p-stat-label">You Owe</div><div className="lp-p-stat-val">₹4,320</div></div>
                    <div className="lp-p-stat owed"><div className="lp-p-stat-label">Owed to You</div><div className="lp-p-stat-val">₹7,840</div></div>
                    <div className="lp-p-stat net"><div className="lp-p-stat-label">Net Balance</div><div className="lp-p-stat-val">+₹3,520</div></div>
                  </div>
                  <div className="lp-p-grid">
                    <div className="lp-p-card">
                      <div className="lp-p-card-title">Recent Activity</div>
                      {[
                        { l: 'P', bg: 'linear-gradient(135deg,#F59E0B,#D97706)', text: <><strong>Priya</strong> added Dinner at Truffles</>, amt: '-₹680', cls: 'r' },
                        { l: 'R', bg: 'linear-gradient(135deg,#3B6FD4,#059669)', text: <>You settled up with <strong>Arjun</strong></>,       amt: '+₹2,100', cls: 'g' },
                        { l: 'A', bg: 'linear-gradient(135deg,#F98080,#E02424)', text: <><strong>Arjun</strong> added Uber to Airport</>,       amt: '-₹340', cls: 'r' },
                      ].map(({ l, bg, text, amt, cls }, i) => (
                        <div key={i} className="lp-p-feed-item">
                          <div className="lp-p-avatar" style={{ background: bg }}>{l}</div>
                          <div className="lp-p-feed-name">{text}</div>
                          <div className={`lp-p-feed-amount ${cls}`}>{amt}</div>
                        </div>
                      ))}
                    </div>
                    <div className="lp-p-card">
                      <div className="lp-p-card-title">Groups</div>
                      {[
                        { icon: <Plane size={12} />,     name: 'Goa Trip',     bal: '-₹1,420', col: '#E02424' },
                        { icon: <Home  size={12} />,     name: 'Mumbai Flat',  bal: '+₹3,100', col: '#059669' },
                        { icon: <Utensils size={12} />,  name: 'Office Lunch', bal: '+₹840',   col: '#059669' },
                      ].map(({ icon, name, bal, col }, i) => (
                        <div key={i} className="lp-p-group-item">
                          <div className="lp-p-group-icon">{icon}</div>
                          <div className="lp-p-group-name">{name}</div>
                          <div className="lp-p-group-bal" style={{ color: col }}>{bal}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating optimized settlements card */}
          <div className="lp-preview-floating">
            <div className="lp-pf-title"><Zap size={11} color="#2154B3" /> Optimized Settlements</div>
            {[
              { name: 'Priya → Rahul', amt: '₹1,420', col: '#3B6FD4' },
              { name: 'Arjun → Rahul', amt: '₹2,100', col: '#6B96E8' },
              { name: 'Sneha → Rahul', amt: '₹2,200', col: '#ADC6F5' },
            ].map(({ name, amt, col }, i) => (
              <div key={i} className="lp-pf-row">
                <div className="lp-pf-dot" style={{ background: col }} />
                <div className="lp-pf-name">{name}</div>
                <div className="lp-pf-amt">{amt}</div>
              </div>
            ))}
            <div className="lp-pf-badge">6 transactions → 3  ·  50% fewer payments</div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TICKER
      ════════════════════════════════════════ */}
      <div className="lp-ticker-bar">
        <div className="lp-ticker-track">
          {[...Array(2)].flatMap(() => [
            <div key="a1" className="lp-ticker-item"><strong>12,000+</strong> active users<span className="lp-ticker-sep">·</span></div>,
            <div key="a2" className="lp-ticker-item">Used in <strong>80+ countries</strong><span className="lp-ticker-sep">·</span></div>,
            <div key="a3" className="lp-ticker-item"><strong>₹2.4 Crore+</strong> settled to date<span className="lp-ticker-sep">·</span></div>,
            <div key="a4" className="lp-ticker-item">Avg <strong>52% fewer</strong> transactions<span className="lp-ticker-sep">·</span></div>,
            <div key="a5" className="lp-ticker-item"><strong>Zero</strong> subscription to start<span className="lp-ticker-sep">·</span></div>,
            <div key="a6" className="lp-ticker-item">SOC2 compliant<span className="lp-ticker-sep">·</span></div>,
            <div key="a7" className="lp-ticker-item">Works for <strong>any group size</strong><span className="lp-ticker-sep">·</span></div>,
          ])}
        </div>
      </div>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section className="lp-section lp-how-section" id="how">
        <div className="lp-section-inner">
          <div className="lp-section-center">
            <div className="lp-eyebrow" style={{ margin: '0 auto 18px' }}>How it works</div>
            <h2 className="lp-section-title light">From group chaos to<br />crystal-clear settlements</h2>
            <p className="lp-section-sub light" style={{ margin: '0 auto' }}>
              Four steps to eliminate the mental math and awkward money conversations forever.
            </p>
          </div>
          <div className="lp-how-grid">
            {[
              { num: '01', icon: <Users size={24} />,        title: 'Create a Group',    desc: 'Name your group, invite friends by phone or email. Works for trips, flatmates, events — any shared expense scenario.' },
              { num: '02', icon: <Receipt size={24} />,      title: 'Add Expenses',      desc: 'Log who paid and split equally, by percentage, or exact amounts. Add a description to keep everyone on the same page.' },
              { num: '03', icon: <Zap size={24} />,          title: 'Run Optimization',  desc: 'Our graph algorithm runs Minimum Cash Flow to eliminate redundant transactions. 6 debts become 3 in one click.' },
              { num: '04', icon: <CheckCircle size={24} />,  title: 'Settle Up',         desc: 'Follow the optimized payment list. Mark transactions as done. The group is settled, history logged, everyone\'s happy.' },
            ].map(({ num, icon, title, desc }, i) => (
              <div key={i} className="lp-how-step">
                {i < 3 && <div className="lp-step-connector" />}
                <div className="lp-step-num">{num}</div>
                <div className="lp-step-icon">{icon}</div>
                <div className="lp-step-title">{title}</div>
                <div className="lp-step-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════ */}
      <div className="lp-stats-bar-section">
        <div className="lp-stats-bar-inner">
          {[
            { val: <>12<span className="accent">k+</span></>,    label: 'Active users globally' },
            { val: <>52<span className="accent">%</span></>,     label: 'Average transactions saved' },
            { val: <>₹2.4<span className="accent">Cr</span></>,  label: 'Total amount settled' },
            { val: <>4.9<span className="accent">★</span></>,    label: 'Average user rating' },
          ].map(({ val, label }, i) => (
            <div key={i} className="lp-stat-item">
              <div className="lp-stat-item-val">{val}</div>
              <div className="lp-stat-item-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          FEATURES BENTO
      ════════════════════════════════════════ */}
      <section className="lp-section lp-features-section" id="features">
        <div className="lp-section-inner">
          <div>
            <div className="lp-eyebrow">Features</div>
            <h2 className="lp-section-title dark">Everything a group needs.<br />Nothing it doesn't.</h2>
            <p className="lp-section-sub dark">Built with the precision of fintech and the simplicity of a notes app.</p>
          </div>

          <div className="lp-bento">
            {/* Large card — graph optimization */}
            <div className="lp-bento-card lp-bc-1">
              <div className="lp-bento-card-inner">
                <div className="lp-bento-tag"><Zap size={11} /> Core Algorithm</div>
                <div className="lp-bento-title">Graph-based minimum<br />cash flow optimization</div>
                <div className="lp-bento-desc">
                  Instead of naive pairwise debts, SmartSplit models your group as a directed weighted graph. Our algorithm
                  computes the minimum number of transactions to settle all balances — the same approach used in distributed
                  financial systems.
                </div>
                <div className="lp-graph-preview">
                  <svg viewBox="0 0 440 200" height="200" style={{ width: '100%', maxWidth: 400, display: 'block', margin: '0 auto' }}>
                    <defs>
                      <marker id="arr1" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L7,3 z" fill="#2154B3" />
                      </marker>
                    </defs>
                    <text x="72" y="16" textAnchor="middle" fontFamily="DM Mono,sans-serif" fontSize="9" fill="#9CA3AF" letterSpacing="0.08em">BEFORE</text>
                    <circle cx="72" cy="50" r="18" fill="#FDE8E8" stroke="#F05252" strokeWidth="1.5" />
                    <text x="72" y="55" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="10" fontWeight="600" fill="#9B1C1C">P</text>
                    <circle cx="28" cy="110" r="18" fill="#FDE8E8" stroke="#F05252" strokeWidth="1.5" />
                    <text x="28" y="115" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="10" fontWeight="600" fill="#9B1C1C">A</text>
                    <circle cx="116" cy="110" r="18" fill="#FDE8E8" stroke="#F05252" strokeWidth="1.5" />
                    <text x="116" y="115" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="10" fontWeight="600" fill="#9B1C1C">S</text>
                    <circle cx="72" cy="170" r="18" fill="#EEF4FE" stroke="#ADC6F5" strokeWidth="1.5" />
                    <text x="72" y="175" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="10" fontWeight="600" fill="#1A3F85">R</text>
                    <line x1="67" y1="67" x2="35" y2="93"   stroke="#F05252" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
                    <line x1="77" y1="67" x2="109" y2="93"  stroke="#F05252" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
                    <line x1="40" y1="125" x2="62" y2="153" stroke="#F05252" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
                    <line x1="104" y1="125" x2="82" y2="153" stroke="#F05252" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
                    <line x1="35" y1="105" x2="109" y2="105" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
                    <text x="72" y="90" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="9" fill="#9CA3AF">6 transactions</text>

                    <rect x="195" y="88" width="50" height="24" rx="8" fill="#EEF4FE" />
                    <text x="220" y="104" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="13" fontWeight="700" fill="#2154B3">→</text>

                    <text x="368" y="16" textAnchor="middle" fontFamily="DM Mono,sans-serif" fontSize="9" fill="#059669" letterSpacing="0.08em">AFTER</text>
                    <circle cx="368" cy="50" r="18" fill="#EEF4FE" stroke="#ADC6F5" strokeWidth="2" />
                    <text x="368" y="55" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="10" fontWeight="700" fill="#1A3F85">R</text>
                    <circle cx="324" cy="130" r="18" fill="#FDE8E8" stroke="#F98080" strokeWidth="1.5" />
                    <text x="324" y="135" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="10" fontWeight="600" fill="#9B1C1C">P</text>
                    <circle cx="368" cy="170" r="18" fill="#FDE8E8" stroke="#F98080" strokeWidth="1.5" />
                    <text x="368" y="175" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="10" fontWeight="600" fill="#9B1C1C">A</text>
                    <circle cx="412" cy="130" r="18" fill="#FDE8E8" stroke="#F98080" strokeWidth="1.5" />
                    <text x="412" y="135" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="10" fontWeight="600" fill="#9B1C1C">S</text>
                    <line x1="332" y1="113" x2="358" y2="67"  stroke="#2154B3" strokeWidth="2" markerEnd="url(#arr1)" />
                    <line x1="368" y1="153" x2="368" y2="68"  stroke="#2154B3" strokeWidth="2" markerEnd="url(#arr1)" />
                    <line x1="404" y1="113" x2="378" y2="67"  stroke="#2154B3" strokeWidth="2" markerEnd="url(#arr1)" />
                    <text x="368" y="108" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="9" fill="#059669" fontWeight="500">3 transactions</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Savings stat */}
            <div className="lp-bento-card lp-bc-2">
              <div className="lp-bento-card-inner">
                <div className="lp-bento-tag green"><TrendingUp size={11} /> Avg. savings</div>
                <div className="lp-bento-stat-big green">52%</div>
                <div className="lp-bento-title">Fewer transactions<br />on average</div>
                <div className="lp-bento-desc">Groups of 5+ members see the biggest gains — often reducing 10+ debts to just 3–4 payments.</div>
                <div className="lp-opt-before-after">
                  <div className="lp-opt-box before"><div className="lp-opt-num">8</div><div className="lp-opt-label">Before</div></div>
                  <div className="lp-opt-arrow"><ArrowRight size={20} /></div>
                  <div className="lp-opt-box after"><div className="lp-opt-num">3</div><div className="lp-opt-label">After</div></div>
                </div>
              </div>
            </div>

            {/* Real-time activity */}
            <div className="lp-bento-card lp-bc-3">
              <div className="lp-bento-card-inner">
                <div className="lp-bento-tag"><Bell size={11} /> Real-time</div>
                <div className="lp-bento-title">Live group activity feed</div>
                <div className="lp-bento-desc">Every expense, settlement, and invite shows up instantly for all group members.</div>
                <div className="lp-activity-list">
                  {[
                    { l: 'P', bg: 'linear-gradient(135deg,#F59E0B,#D97706)', text: <><strong>Priya</strong> added "Dinner" · ₹3,400</>, amt: '-₹680',   col: '#E02424' },
                    { l: 'R', bg: 'linear-gradient(135deg,#3B6FD4,#059669)', text: <><strong>You</strong> settled with Arjun</>,             amt: '+₹2,100', col: '#059669' },
                    { l: 'A', bg: 'linear-gradient(135deg,#F98080,#E02424)', text: <><strong>Arjun</strong> added "Uber" · ₹1,700</>,        amt: '-₹340',   col: '#E02424' },
                  ].map(({ l, bg, text, amt, col }, i) => (
                    <div key={i} className="lp-act-item">
                      <Avatar label={l} bg={bg} size={28} />
                      <div className="lp-act-text">{text}</div>
                      <span className="lp-act-amt" style={{ color: col, fontSize: 11 }}>{amt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Split types */}
            <div className="lp-bento-card lp-bc-4">
              <div className="lp-bento-card-inner">
                <div className="lp-bento-tag"><Scale size={11} /> Flexible</div>
                <div className="lp-bento-title">4 ways to split</div>
                <div className="lp-split-types">
                  {[
                    { icon: '÷', label: 'Equal',      desc: 'Divided evenly',   active: true },
                    { icon: '%', label: 'Percentage',  desc: 'Custom ratios',    active: false },
                    { icon: '₹', label: 'Exact',       desc: 'Specific amounts', active: false },
                  ].map(({ icon, label, desc, active }, i) => (
                    <div key={i} className={`lp-split-type-item${active ? ' active' : ''}`}>
                      <div className="lp-split-type-icon">{icon}</div>
                      <div>
                        <div className="lp-split-type-label">{label}</div>
                        <div className="lp-split-type-desc">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Multi-group */}
            <div className="lp-bento-card lp-bc-5">
              <div className="lp-bento-card-inner">
                <div className="lp-bento-tag"><Globe size={11} /> Multi-group</div>
                <div className="lp-bento-title">Unlimited groups</div>
                <div className="lp-bento-desc">Manage your trip, your flat, your office — all in separate groups with independent balances.</div>
                <div className="lp-group-tags">
                  {[
                    { icon: <Plane size={11} />,       label: 'Trips',    cls: 'blue'  },
                    { icon: <Home size={11} />,         label: 'Flatmates', cls: 'green' },
                    { icon: <Utensils size={11} />,     label: 'Dining',   cls: 'amber' },
                    { icon: <PartyPopper size={11} />,  label: 'Events',   cls: 'red'   },
                  ].map(({ icon, label, cls }, i) => (
                    <span key={i} className={`lp-group-tag ${cls}`}>{icon} {label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Spending analytics */}
            <div className="lp-bento-card lp-bc-6">
              <div className="lp-bento-card-inner">
                <div className="lp-bento-tag amber"><BarChart3 size={11} /> Insights</div>
                <div className="lp-bento-title">Spending analytics</div>
                <div className="lp-bento-desc">Visual breakdowns by category, member, and timeline.</div>
                <div className="lp-bar-chart">
                  {[
                    { h: '100%', bg: '#2154B3', op: 0.8 },
                    { h: '78%',  bg: '#2154B3', op: 0.6 },
                    { h: '60%',  bg: '#059669', op: 0.7 },
                    { h: '45%',  bg: '#059669', op: 0.5 },
                    { h: '35%',  bg: '#F59E0B', op: 0.7 },
                    { h: '25%',  bg: '#F98080', op: 0.7 },
                  ].map(({ h, bg, op }, i) => (
                    <div key={i} className="lp-bar-chart-bar" style={{ height: h, background: bg, opacity: op }} />
                  ))}
                </div>
                <div className="lp-bar-chart-labels">
                  {['SEP','OCT','NOV','DEC','JAN','FEB'].map(m => (
                    <span key={m} className="lp-bar-chart-label">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ALGORITHM DEEP DIVE
      ════════════════════════════════════════ */}
      <section className="lp-section lp-graph-section">
        <div className="lp-graph-section-inner">
          <div>
            <div className="lp-eyebrow">The algorithm</div>
            <h2 className="lp-section-title light" style={{ fontSize: 'clamp(28px,3.5vw,44px)' }}>
              Built on real graph theory — not guesswork
            </h2>
            <p className="lp-section-sub light">
              Most apps just show you who owes what. SmartSplit computes the mathematically optimal settlement path using
              Minimum Cash Flow — a proven algorithm from computer science.
            </p>
            <div className="lp-graph-feature-list">
              {[
                { icon: <Link2 size={18} />,       title: 'Directed weighted graph model',   desc: 'Every debt is an edge. Every person is a node. The algorithm treats your group as a financial graph and solves it as a flow optimization problem.' },
                { icon: <Scale size={18} />,        title: 'Net balance computation',         desc: 'Before optimization, we compute each person\'s net position. Creditors and debtors are matched greedily to minimize total transactions.' },
                { icon: <TrendingUp size={18} />,   title: 'Scales to any group size',        desc: 'Whether it\'s 3 flatmates or a 20-person team, the algorithm runs in O(n log n). Large groups see the biggest savings.' },
              ].map(({ icon, title, desc }, i) => (
                <div key={i} className="lp-gf-item">
                  <div className="lp-gf-icon">{icon}</div>
                  <div>
                    <div className="lp-gf-title">{title}</div>
                    <div className="lp-gf-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="lp-graph-visual-card">
              <div className="lp-gv-header">
                <div className="lp-gv-title"><Zap size={14} color="#6B96E8" /> Live Optimization Preview</div>
                <div className="lp-gv-badge">Min-Cash-Flow</div>
              </div>
              <svg width="100%" viewBox="0 0 340 260" style={{ display: 'block' }}>
                <defs>
                  <marker id="opt-arr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L7,3 z" fill="#3B6FD4" />
                  </marker>
                </defs>
                <text x="170" y="14" textAnchor="middle" fontFamily="DM Mono,sans-serif" fontSize="9" fill="rgba(255,255,255,0.3)" letterSpacing="0.08em">OPTIMIZED GRAPH</text>
                <circle cx="170" cy="50"  r="24" fill="rgba(33,84,179,0.25)" stroke="#3B6FD4" strokeWidth="2" />
                <text x="170" y="55"  textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="12" fontWeight="700" fill="#fff">RK</text>
                <circle cx="60"  cy="140" r="22" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <text x="60"  y="145" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.7)">P</text>
                <circle cx="140" cy="220" r="22" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <text x="140" y="225" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.7)">A</text>
                <circle cx="200" cy="220" r="22" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <text x="200" y="225" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.7)">S</text>
                <circle cx="280" cy="140" r="22" fill="rgba(16,185,129,0.15)" stroke="rgba(52,211,153,0.4)" strokeWidth="1.5" />
                <text x="280" y="145" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="11" fontWeight="600" fill="#34D399">V</text>
                <line x1="80"  y1="124" x2="147" y2="70" stroke="#3B6FD4" strokeWidth="2" markerEnd="url(#opt-arr)" />
                <line x1="160" y1="200" x2="162" y2="74" stroke="#3B6FD4" strokeWidth="2" markerEnd="url(#opt-arr)" />
                <line x1="200" y1="200" x2="182" y2="70" stroke="#3B6FD4" strokeWidth="2" markerEnd="url(#opt-arr)" />
                <rect x="86"  y="89"  width="48" height="15" rx="4" fill="rgba(33,84,179,0.3)" />
                <text x="110" y="101" textAnchor="middle" fontFamily="DM Mono,sans-serif" fontSize="9" fill="#ADC6F5" fontWeight="500">₹1,420</text>
                <rect x="126" y="138" width="48" height="15" rx="4" fill="rgba(33,84,179,0.3)" />
                <text x="150" y="150" textAnchor="middle" fontFamily="DM Mono,sans-serif" fontSize="9" fill="#ADC6F5" fontWeight="500">₹2,100</text>
                <rect x="196" y="132" width="48" height="15" rx="4" fill="rgba(33,84,179,0.3)" />
                <text x="220" y="144" textAnchor="middle" fontFamily="DM Mono,sans-serif" fontSize="9" fill="#ADC6F5" fontWeight="500">₹2,200</text>
              </svg>
              <div className="lp-savings-pill">
                <div>
                  <div className="lp-sp-label">Transactions Reduced</div>
                  <div className="lp-sp-value">6 → 3 settlements</div>
                  <div className="lp-sp-sub">₹5,720 cleared in 3 payments</div>
                </div>
                <div className="lp-sp-pct">50%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section className="lp-section lp-testimonials-section">
        <div className="lp-section-inner">
          <div className="lp-section-center">
            <div className="lp-eyebrow" style={{ margin: '0 auto 18px' }}>Testimonials</div>
            <h2 className="lp-section-title light">Trusted by groups everywhere</h2>
            <p className="lp-section-sub light" style={{ margin: '0 auto' }}>
              From weekend trips to year-long flat shares — here's what real users say.
            </p>
          </div>
          <div className="lp-testimonials-grid">
            {[
              { avatar: 'P', bg: 'linear-gradient(135deg,#F59E0B,#D97706)', quote: 'We used to fight over who paid what after every trip. SmartSplit ended that completely — the optimization is genuinely magic. We had 12 debts become 4 transactions.', name: 'Priya Mehta', role: 'UX Designer · Bangalore' },
              { avatar: 'A', bg: 'linear-gradient(135deg,#3B6FD4,#059669)', quote: 'Finally a Splitwise alternative that actually thinks about math. The minimum cash flow algorithm is exactly what group finances needed. Setup took 2 minutes.', name: 'Arjun Sharma', role: 'Software Engineer · Mumbai' },
              { avatar: 'S', bg: 'linear-gradient(135deg,#34D399,#047857)', quote: 'My flatmates and I have been using this for 8 months. The UI is clean, the graphs make intuitive sense, and we\'ve never had a single dispute about money since.', name: 'Sneha Iyer', role: 'Product Manager · Delhi' },
            ].map(({ avatar, bg, quote, name, role }, i) => (
              <div key={i} className="lp-testimonial-card">
                <Stars />
                <div className="lp-tcard-quote">{quote}</div>
                <div className="lp-tcard-author">
                  <div className="lp-tcard-avatar" style={{ background: bg }}>{avatar}</div>
                  <div>
                    <div className="lp-tcard-name">{name}</div>
                    <div className="lp-tcard-role">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PRICING
      ════════════════════════════════════════ */}
      <section className="lp-section lp-pricing-section" id="pricing">
        <div className="lp-section-inner">
          <div className="lp-section-center">
            <div className="lp-eyebrow" style={{ margin: '0 auto 18px' }}>Pricing</div>
            <h2 className="lp-section-title dark">Simple, honest pricing</h2>
            <p className="lp-section-sub dark" style={{ margin: '0 auto' }}>
              Start free, upgrade when your groups grow. No hidden fees, no per-transaction charges.
            </p>
          </div>
          <div className="lp-pricing-grid">
            {[
              {
                name: 'Free', price: '0', period: 'Forever free', popular: false,
                desc: 'Perfect for getting started with a small group or trying out the optimization engine.',
                features: ['Up to 3 groups','10 expenses per group','Graph optimization','Basic analytics','Mobile app'],
                cta: 'Start free',
              },
              {
                name: 'Pro', price: '299', period: 'per month, billed annually', popular: true,
                desc: 'For active groups that settle often. Unlimited everything with priority support.',
                features: ['Unlimited groups','Unlimited expenses','Advanced optimization','Full analytics & exports','Settlement history','Priority support'],
                cta: 'Get Pro',
              },
              {
                name: 'Team', price: '899', period: 'per month, up to 20 members', popular: false,
                desc: 'For offices, organizations, and large friend groups that need collaboration features.',
                features: ['Everything in Pro','Admin controls','Team analytics dashboard','CSV / PDF export','Dedicated support','SSO (coming soon)'],
                cta: 'Contact sales',
              },
            ].map(({ name, price, period, popular, desc, features, cta }, i) => (
              <div key={i} className={`lp-pricing-card${popular ? ' popular' : ''}`}>
                {popular && <div className="lp-popular-pill">Most Popular</div>}
                <div className="lp-plan-name">{name}</div>
                <div className="lp-plan-price"><span>₹</span>{price}</div>
                <div className="lp-plan-period">{period}</div>
                <div className="lp-plan-desc">{desc}</div>
                <div className="lp-plan-divider" />
                <div className="lp-plan-features">
                  {features.map(f => (
                    <div key={f} className="lp-plan-feature">
                      <div className="lp-feature-check"><CheckCircle size={10} /></div>
                      {f}
                    </div>
                  ))}
                </div>
                {popular
                  ? <button className="lp-plan-cta-primary" onClick={() => navigate('/signup')}>{cta} →</button>
                  : <button className="lp-plan-cta-ghost"   onClick={() => navigate('/signup')}>{cta} →</button>
                }
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ
      ════════════════════════════════════════ */}
      <section className="lp-section lp-faq-section" id="faq">
        <div className="lp-section-inner">
          <div className="lp-section-center">
            <div className="lp-eyebrow" style={{ margin: '0 auto 18px' }}>FAQ</div>
            <h2 className="lp-section-title dark">Questions we get a lot</h2>
            <p className="lp-section-sub dark" style={{ margin: '0 auto' }}>
              Still not sure? Here are the most common things people ask before signing up.
            </p>
          </div>
          <div className="lp-faq-grid">
            {[
              { q: 'How is SmartSplit different from Splitwise?',      a: 'Splitwise shows pairwise debts. SmartSplit runs a graph optimization algorithm that computes the mathematically minimum number of transactions to fully settle a group — often reducing payments by 50% or more.' },
              { q: 'What is Minimum Cash Flow?',                       a: "It's a graph algorithm that computes net balances for each person, then greedily matches the largest creditor with the largest debtor, reducing the total number of transactions to settle all debts simultaneously." },
              { q: 'Is my data secure?',                               a: 'Yes. All data is encrypted at rest and in transit. We use industry-standard OAuth 2.0 for authentication and store only the minimum required data. We do not sell your data — ever.' },
              { q: 'Does it support multiple currencies?',             a: 'Yes. You can set a default currency per group. Multi-currency support within a single group is on our roadmap for Q2 2025.' },
              { q: "Can I use it without everyone signing up?",        a: "You can add members by phone number even if they haven't joined. They'll receive an invite and can view their balance. Full participation requires a free account." },
              { q: 'What happens to my data if I cancel?',             a: 'You can export all your data as CSV or PDF before cancelling. After 30 days of account closure, all personal data is permanently deleted from our servers.' },
            ].map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section className="lp-cta-section">
        <div className="lp-cta-orb-1" />
        <div className="lp-cta-orb-2" />
        <div className="lp-cta-inner">
          <div className="lp-cta-tag">
            <span className="lp-cta-dot" />
            Free to start · No credit card needed
          </div>
          <h2 className="lp-cta-headline">
            Stop overcomplicating<br /><span>group money.</span>
          </h2>
          <p className="lp-cta-sub">
            Join 12,000+ people who've replaced awkward money conversations with one clean settlement screen.
          </p>
          <div className="lp-cta-btns">
            <button className="lp-btn-hero-primary" style={{ fontSize: 16, padding: '16px 36px' }} onClick={() => navigate('/signup')}>
              Get started for free <ArrowRight size={16} />
            </button>
            <button className="lp-btn-hero-ghost" style={{ fontSize: 16, padding: '16px 30px' }} onClick={() => scrollTo('how')}>
              See a demo
            </button>
          </div>
          <div className="lp-cta-note">
            No credit card required · <span>Free forever plan available</span> · Cancel anytime
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-top">
            <div>
              <div className="lp-footer-logo">
                <div className="lp-footer-logo-icon">S</div>
                <div className="lp-footer-logo-text">Smart<span>Split</span></div>
              </div>
              <div className="lp-footer-tagline">
                Intelligent graph-based expense settlement for modern groups. Split smarter, not harder.
              </div>
              <div className="lp-footer-social">
                {[
                  { icon: <Twitter size={14} /> },
                  { icon: <Linkedin size={14} /> },
                  { icon: <Github size={14} /> },
                  { icon: <Mail size={14} /> },
                ].map(({ icon }, i) => (
                  <div key={i} className="lp-social-btn">{icon}</div>
                ))}
              </div>
            </div>

            {[
              { title: 'Product',  links: ['Features','Pricing','Changelog','Roadmap','API Docs'] },
              { title: 'Company',  links: ['About','Blog','Careers','Press Kit'] },
              { title: 'Support',  links: ['Help Center','Contact Us','Status','Community'] },
              { title: 'Legal',    links: ['Privacy Policy','Terms of Service','Cookie Policy','Security'] },
            ].map(({ title, links }) => (
              <div key={title} className="lp-footer-col">
                <h5>{title}</h5>
                <div className="lp-footer-links">
                  {links.map(l => <div key={l} className="lp-footer-link">{l}</div>)}
                </div>
              </div>
            ))}
          </div>

          <div className="lp-footer-bottom">
            <span>© 2025 SmartSplit Technologies. All rights reserved.</span>
            <div className="lp-footer-bottom-links">
              {['Privacy','Terms','Cookies'].map(l => (
                <div key={l} className="lp-footer-bottom-link">{l}</div>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
