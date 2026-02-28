import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { groupsApi, type Group, type Balance } from '../../services/api'
import { useAuth } from '../../context/useAuth'
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  Plus,
  Users,
  ArrowRight,
  Receipt,
} from 'lucide-react'

export default function DashboardHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [groups, setGroups] = useState<Group[]>([])
  const [balancesMap, setBalancesMap] = useState<Record<number, Balance[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { groups: g } = await groupsApi.getMyGroups()
        if (cancelled) return
        setGroups(g)

        // fetch balances for each group
        const entries = await Promise.all(
          g.map(async (grp) => {
            try {
              const { balances } = await groupsApi.getBalances(grp.groupId)
              return [grp.groupId, balances] as [number, Balance[]]
            } catch {
              return [grp.groupId, []] as [number, Balance[]]
            }
          }),
        )
        if (!cancelled) {
          setBalancesMap(Object.fromEntries(entries))
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // compute aggregate stats
  const myId = user?.userId
  let totalOwe = 0
  let totalOwed = 0
  const groupBalances: { groupId: number; balance: number }[] = []

  for (const grp of groups) {
    const bals = balancesMap[grp.groupId] ?? []
    const mine = bals.find((b) => b.user.userId === myId)
    const bal = mine?.balance ?? 0
    groupBalances.push({ groupId: grp.groupId, balance: bal })
    if (bal < 0) totalOwe += Math.abs(bal)
    else totalOwed += bal
  }
  const netBalance = totalOwed - totalOwe

  const fmt = (n: number) => {
    const abs = Math.abs(n)
    return abs.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  }

  // pick icon color for group
  const iconColors = ['blue', 'green', 'amber', 'red'] as const

  // recent expenses across groups (from group data which includes last 10 expenses)
  const recentExpenses = groups
    .flatMap((g) =>
      (g.expenses ?? []).map((e) => ({
        ...e,
        groupName: g.groupName,
        groupId: g.groupId,
      })),
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Dashboard</div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/groups')}>
            <Plus size={14} /> Create Group
          </button>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="stats-row">
              <div className="stat-card owe">
                <div className="stat-label">
                  <span className="stat-dot" style={{ background: 'var(--danger-400)' }} />
                  You Owe
                </div>
                <div className="stat-amount" style={{ color: totalOwe > 0 ? 'var(--danger-500)' : undefined }}>
                  {totalOwe > 0 ? '-' : ''}₹{fmt(totalOwe)}
                </div>
                <div className="stat-sub">
                  <TrendingDown size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
                  <span className="red">
                    {groupBalances.filter((g) => g.balance < 0).length} groups
                  </span>
                </div>
              </div>

              <div className="stat-card owed">
                <div className="stat-label">
                  <span className="stat-dot" style={{ background: 'var(--accent-400)' }} />
                  You're Owed
                </div>
                <div className="stat-amount" style={{ color: totalOwed > 0 ? 'var(--accent-600)' : undefined }}>
                  +₹{fmt(totalOwed)}
                </div>
                <div className="stat-sub">
                  <TrendingUp size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
                  <span className="green">
                    {groupBalances.filter((g) => g.balance > 0).length} groups
                  </span>
                </div>
              </div>

              <div className="stat-card net">
                <div className="stat-label">
                  <span className="stat-dot" style={{ background: 'var(--primary-400)' }} />
                  Net Balance
                </div>
                <div
                  className="stat-amount"
                  style={{
                    color: netBalance > 0 ? 'var(--accent-600)' : netBalance < 0 ? 'var(--danger-500)' : undefined,
                  }}
                >
                  {netBalance >= 0 ? '+' : '-'}₹{fmt(Math.abs(netBalance))}
                </div>
                <div className="stat-sub">
                  <Wallet size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
                  <span className={netBalance >= 0 ? 'green' : 'red'}>
                    {netBalance >= 0 ? "You're in the green" : "You're in the red"} overall
                  </span>
                </div>
              </div>
            </div>

            {/* 2-Column: Feed + Groups */}
            <div className="dash-grid">
              {/* Activity feed */}
              <div className="card">
                <div className="feed-header">
                  <div className="feed-title">Recent Activity</div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/dashboard/groups')
                    }}
                    style={{ fontSize: 12, color: 'var(--primary-500)', fontWeight: 500 }}
                  >
                    View all
                  </a>
                </div>
                <div className="feed-list">
                  {recentExpenses.length === 0 ? (
                    <div className="empty-state" style={{ padding: '30px 20px' }}>
                      <Receipt size={36} className="empty-icon" />
                      <div className="empty-title">No recent activity</div>
                      <div className="empty-sub">Expenses you add will show up here.</div>
                    </div>
                  ) : (
                    recentExpenses.map((exp) => {
                      const isPayer = exp.paidBy === myId
                      return (
                        <div
                          className="feed-item"
                          key={exp.expenseId}
                          onClick={() => navigate(`/dashboard/groups/${exp.groupId}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="feed-avatar">
                            {isPayer
                              ? (user?.username?.[0] ?? '?').toUpperCase()
                              : (exp.payer?.username?.[0] ?? '?').toUpperCase()}
                          </div>
                          <div className="feed-info">
                            <div className="feed-text">
                              <strong>{isPayer ? 'You' : exp.payer?.username ?? 'Someone'}</strong>{' '}
                              added "{exp.title}" in {exp.groupName}
                            </div>
                            <div className="feed-time">{timeAgo(exp.createdAt)}</div>
                          </div>
                          <div className={`feed-amount ${isPayer ? 'green' : 'red'}`}>
                            {isPayer ? '+' : '-'}₹{fmt(Number(exp.amount))}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Quick Groups */}
              <div className="card">
                <div className="qs-title">Your Groups</div>
                {groups.length === 0 ? (
                  <div className="empty-state" style={{ padding: '30px 10px' }}>
                    <Users size={36} className="empty-icon" />
                    <div className="empty-title">No groups yet</div>
                    <div className="empty-sub">Create a group to start splitting expenses.</div>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/groups')}>
                      <Plus size={14} /> Create Group
                    </button>
                  </div>
                ) : (
                  <>
                    {groups.map((grp, idx) => {
                      const bal = groupBalances.find((g) => g.groupId === grp.groupId)?.balance ?? 0
                      const color = iconColors[idx % iconColors.length]
                      return (
                        <div
                          className="group-mini-card"
                          key={grp.groupId}
                          onClick={() => navigate(`/dashboard/groups/${grp.groupId}`)}
                        >
                          <div className={`group-icon ${color}`}>
                            <Users size={16} />
                          </div>
                          <div className="group-mini-info">
                            <div className="group-mini-name">{grp.groupName}</div>
                            <div className="group-mini-meta">
                              {grp.memberships.length} members
                              {grp._count?.expenses != null ? ` · ${grp._count.expenses} expenses` : ''}
                            </div>
                          </div>
                          <div className={`group-mini-balance ${bal >= 0 ? 'pos' : 'neg'}`}>
                            {bal >= 0 ? '+' : '-'}₹{fmt(Math.abs(bal))}
                          </div>
                        </div>
                      )
                    })}
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                      onClick={() => navigate('/dashboard/groups')}
                    >
                      <ArrowRight size={14} /> View All Groups
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
