import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { groupsApi, analyticsApi, type Group, type AnalyticsData } from '../../services/api'
import { BarChart3, Users, DollarSign } from 'lucide-react'

export default function AnalyticsPage() {
  const [searchParams] = useSearchParams()
  const preselected = Number(searchParams.get('group')) || 0

  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState(preselected)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    groupsApi.getMyGroups().then(({ groups }) => setGroups(groups)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedGroup) return
    setLoading(true)
    setError('')
    analyticsApi
      .getGroupAnalytics(selectedGroup)
      .then(setData)
      .catch((err: { message?: string }) => setError(err.message ?? 'Failed to load'))
      .finally(() => setLoading(false))
  }, [selectedGroup])

  const fmt = (n: number) =>
    Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

  // compute max for bar chart scaling
  const maxPersonSpend = data ? Math.max(...data.spendingByPerson.map(p => p.amount), 1) : 1
  const maxTimeline = data ? Math.max(...data.spendingTimeline.map(t => t.amount), 1) : 1

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">
          <BarChart3 size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
          Analytics
        </div>
      </div>

      <div className="page-body">
        {/* group selector */}
        <div style={{ marginBottom: 20 }}>
          <label className="input-label">Select Group</label>
          <select
            className="input-field"
            style={{ maxWidth: 320 }}
            value={selectedGroup}
            onChange={e => setSelectedGroup(Number(e.target.value))}
          >
            <option value={0}>Choose a group...</option>
            {groups.map(g => (
              <option key={g.groupId} value={g.groupId}>{g.groupName}</option>
            ))}
          </select>
        </div>

        {loading && <div className="loading-container"><div className="spinner" /></div>}
        {error && <div style={{ padding: '14px 20px', background: 'var(--danger-50)', borderRadius: 'var(--radius-lg)', color: 'var(--danger-600)', fontSize: 14, marginBottom: 20 }}>{error}</div>}

        {!selectedGroup && !loading && (
          <div className="empty-state">
            <BarChart3 size={48} className="empty-icon" />
            <div className="empty-title">Select a group to view analytics</div>
            <div className="empty-sub">Spending breakdowns, timelines, and per-person stats.</div>
          </div>
        )}

        {data && !loading && (
          <>
            {/* summary cards */}
            <div className="stats-row">
              <div className="stat-card net">
                <div className="stat-label">
                  <span className="stat-dot" style={{ background: 'var(--primary-400)' }} />
                  Total Spent
                </div>
                <div className="stat-amount">₹{fmt(data.summary.totalSpent)}</div>
                <div className="stat-sub"><DollarSign size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {data.summary.totalExpenses} expenses</div>
              </div>
              <div className="stat-card owed">
                <div className="stat-label">
                  <span className="stat-dot" style={{ background: 'var(--accent-400)' }} />
                  Members
                </div>
                <div className="stat-amount">{data.summary.totalMembers}</div>
                <div className="stat-sub"><Users size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> active members</div>
              </div>
              <div className="stat-card owe">
                <div className="stat-label">
                  <span className="stat-dot" style={{ background: 'var(--danger-400)' }} />
                  Settlements
                </div>
                <div className="stat-amount">{data.summary.completedSettlements + data.summary.pendingSettlements}</div>
                <div className="stat-sub">{data.summary.completedSettlements} completed, {data.summary.pendingSettlements} pending</div>
              </div>
            </div>

            <div className="dash-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {/* spending by person */}
              <div className="card">
                <div className="feed-title" style={{ marginBottom: 16 }}>Spending by Person</div>
                {data.spendingByPerson.map(p => (
                  <div key={p.name} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>₹{fmt(p.amount)}</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(p.amount / maxPersonSpend) * 100}%`, background: 'linear-gradient(90deg, var(--primary-400), var(--accent-400))', borderRadius: 4, transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* spending timeline */}
              <div className="card">
                <div className="feed-title" style={{ marginBottom: 16 }}>Spending Timeline</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160 }}>
                  {data.spendingTimeline.map(t => (
                    <div key={t.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>₹{fmt(t.amount)}</div>
                      <div style={{ width: '80%', background: 'linear-gradient(180deg, var(--primary-400), var(--accent-500))', borderRadius: '4px 4px 0 0', minHeight: 4, height: `${(t.amount / maxTimeline) * 120}px`, transition: 'height 0.3s ease' }} />
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{t.date.slice(5)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* per person breakdown table */}
            <div className="table-wrap" style={{ marginTop: 20 }}>
              <div className="table-toolbar">
                <div className="table-title">Per-Person Breakdown</div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Total Paid</th>
                    <th>Total Owes</th>
                    <th>Net Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.perPersonBreakdown.map(p => (
                    <tr key={p.user.userId}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                            {(p.user.username?.[0] ?? '?').toUpperCase()}
                          </div>
                          {p.user.username}
                        </div>
                      </td>
                      <td><div className="amount-cell" style={{ color: 'var(--accent-600)' }}>₹{fmt(p.totalPaid)}</div></td>
                      <td><div className="amount-cell" style={{ color: 'var(--danger-500)' }}>₹{fmt(p.totalOwes)}</div></td>
                      <td>
                        <div className="amount-cell" style={{ color: p.netBalance >= 0 ? 'var(--accent-600)' : 'var(--danger-500)' }}>
                          {p.netBalance >= 0 ? '+' : '-'}₹{fmt(Math.abs(p.netBalance))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${p.netBalance > 0 ? 'badge-gets' : p.netBalance < 0 ? 'badge-owes' : 'badge-settled'}`}>
                          {p.netBalance > 0 ? 'Gets Back' : p.netBalance < 0 ? 'Owes' : 'Settled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  )
}
