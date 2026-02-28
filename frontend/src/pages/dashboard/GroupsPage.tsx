import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { groupsApi, type Group, type Balance } from '../../services/api'
import { useAuth } from '../../context/useAuth'
import { Plus, Users, X } from 'lucide-react'

export default function GroupsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [groups, setGroups] = useState<Group[]>([])
  const [balancesMap, setBalancesMap] = useState<Record<number, Balance[]>>({})
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const loadGroups = async () => {
    try {
      const { groups: g } = await groupsApi.getMyGroups()
      setGroups(g)
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
      setBalancesMap(Object.fromEntries(entries))
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGroups()
  }, [])

  const handleCreate = async () => {
    if (!newGroupName.trim()) return
    setCreating(true)
    setError('')
    try {
      await groupsApi.create(newGroupName.trim())
      setNewGroupName('')
      setShowCreate(false)
      setLoading(true)
      await loadGroups()
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message ?? 'Failed to create group')
    } finally {
      setCreating(false)
    }
  }

  const myId = user?.userId
  const getMyBalance = (groupId: number) => {
    const bals = balancesMap[groupId] ?? []
    return bals.find((b) => b.user.userId === myId)?.balance ?? 0
  }

  const fmt = (n: number) =>
    Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

  const iconColors = ['blue', 'green', 'amber', 'red'] as const

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Groups</div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
            <Plus size={14} /> New Group
          </button>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
          </div>
        ) : (
          <div className="groups-grid">
            {groups.map((grp, idx) => {
              const bal = getMyBalance(grp.groupId)
              const color = iconColors[idx % iconColors.length]
              const memberCount = grp.memberships.length
              const expenseCount = grp._count?.expenses ?? 0

              return (
                <div
                  className="group-card"
                  key={grp.groupId}
                  onClick={() => navigate(`/dashboard/groups/${grp.groupId}`)}
                >
                  <div className="group-card-header">
                    <div className={`group-emoji ${color}`}>
                      <Users size={20} />
                    </div>
                    <span
                      className={`badge ${
                        bal < 0 ? 'badge-owes' : bal > 0 ? 'badge-gets' : 'badge-settled'
                      }`}
                    >
                      {bal < 0 ? 'You Owe' : bal > 0 ? 'Gets Back' : 'Settled'}
                    </span>
                  </div>
                  <div className="group-name">{grp.groupName}</div>
                  <div className="group-members-text">
                    {memberCount} members · {expenseCount} expenses
                  </div>
                  <div className="group-avatars" style={{ marginTop: 10 }}>
                    {grp.memberships.slice(0, 4).map((m) => {
                      const grad = [
                        'linear-gradient(135deg,#3B6FD4,#059669)',
                        'linear-gradient(135deg,#F59E0B,#D97706)',
                        'linear-gradient(135deg,#6B96E8,#34D399)',
                        'linear-gradient(135deg,#F98080,#E02424)',
                      ]
                      return (
                        <div
                          key={m.userId}
                          className="g-avatar"
                          style={{ background: grad[grp.memberships.indexOf(m) % 4] }}
                        >
                          {(m.user.username?.[0] ?? '?').toUpperCase()}
                        </div>
                      )
                    })}
                    {memberCount > 4 && (
                      <div className="g-avatar g-avatar-more">+{memberCount - 4}</div>
                    )}
                  </div>
                  <div className="group-balance-row">
                    <div className="group-balance-label">Your balance</div>
                    <div
                      className={`group-balance-amount ${
                        bal < 0 ? 'neg' : bal > 0 ? 'pos' : 'zero'
                      }`}
                    >
                      {bal >= 0 ? '+' : '-'}₹{fmt(Math.abs(bal))}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Create New Group Card */}
            <div className="create-group-card" onClick={() => setShowCreate(true)}>
              <div className="plus-icon">
                <Plus size={24} />
              </div>
              <span>Create New Group</span>
              <span style={{ fontSize: 13, color: 'var(--primary-400)', fontWeight: 400 }}>
                Add friends and start splitting
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreate && (
        <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Create New Group</div>
              <button className="modal-close" onClick={() => setShowCreate(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="input-wrapper">
                <label className="input-label">Group Name</label>
                <input
                  className="input-field"
                  placeholder="e.g. Goa Trip 2024"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  autoFocus
                />
              </div>
              {error && (
                <div style={{ color: 'var(--danger-500)', fontSize: 13, marginTop: 8 }}>
                  {error}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={creating}>
                {creating ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
