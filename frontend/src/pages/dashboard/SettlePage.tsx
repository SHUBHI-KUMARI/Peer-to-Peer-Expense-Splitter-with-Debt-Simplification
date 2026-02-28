import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  groupsApi,
  settlementsApi,
  type Group,
  type OptimizeResult,
} from '../../services/api'
import { Zap, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function SettlePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const preselectedGroup = Number(searchParams.get('group')) || 0

  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState(preselectedGroup)
  const [loading, setLoading] = useState(false)
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResult | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    groupsApi.getMyGroups().then(({ groups }) => setGroups(groups)).catch(() => {})
  }, [])

  useEffect(() => {
    if (preselectedGroup) {
      setSelectedGroup(preselectedGroup)
    }
  }, [preselectedGroup])

  const handleOptimize = useCallback(async () => {
    if (!selectedGroup) return
    setLoading(true)
    setError('')
    setOptimizeResult(null)
    setConfirmed(false)
    try {
      const result = await settlementsApi.optimize(selectedGroup)
      setOptimizeResult(result)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message ?? 'Failed to optimize')
    } finally {
      setLoading(false)
    }
  }, [selectedGroup])

  useEffect(() => {
    if (selectedGroup) handleOptimize()
  }, [selectedGroup, handleOptimize])

  const handleConfirm = async () => {
    if (!optimizeResult) return
    setConfirming(true)
    setError('')
    try {
      await settlementsApi.confirm(selectedGroup, optimizeResult.transactions)
      setConfirmed(true)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message ?? 'Failed to confirm settlements')
    } finally {
      setConfirming(false)
    }
  }

  const fmt = (n: number) =>
    Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

  const opt = optimizeResult?.optimization

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">
          <Zap size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
          Settle Up
          {selectedGroup
            ? ` — ${groups.find((g) => g.groupId === selectedGroup)?.groupName ?? ''}`
            : ''}
        </div>
        <div className="topbar-actions">
          <span className="badge badge-primary">Min-Cash-Flow Algorithm</span>
        </div>
      </div>

      <div className="page-body">
        {/* Group selector */}
        {!preselectedGroup && (
          <div style={{ marginBottom: 20 }}>
            <label className="input-label">Select a group to settle</label>
            <select
              className="input-field"
              style={{ maxWidth: 320 }}
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(Number(e.target.value))}
            >
              <option value={0}>Choose a group...</option>
              {groups.map((g) => (
                <option key={g.groupId} value={g.groupId}>
                  {g.groupName}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner" />
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '14px 20px',
              background: 'var(--danger-50)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--danger-600)',
              fontSize: 14,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {optimizeResult && !loading && (
          <>
            {/* Savings Banner */}
            {opt && (
              <div className="savings-banner">
                <div>
                  <div className="savings-label">Transactions Saved by Optimization</div>
                  <div className="savings-value">
                    {opt.before} <ArrowRight size={28} style={{ display: 'inline', verticalAlign: 'middle' }} /> {opt.after}
                  </div>
                  <div className="savings-sub">
                    {opt.percentSaved.toFixed(0)}% fewer transactions required
                  </div>
                </div>
                <div className="savings-stats">
                  <div className="savings-stat">
                    <div className="n">{opt.before}</div>
                    <div className="l">Before</div>
                  </div>
                  <div className="savings-arrow">
                    <ArrowRight size={24} />
                  </div>
                  <div className="savings-stat">
                    <div className="n" style={{ color: 'var(--accent-300)' }}>
                      {opt.after}
                    </div>
                    <div className="l">After Opt.</div>
                  </div>
                  <div className="savings-stat">
                    <div className="n" style={{ color: 'var(--accent-300)' }}>
                      {opt.saved}
                    </div>
                    <div className="l">Saved</div>
                  </div>
                </div>
              </div>
            )}

            {/* Member Balances */}
            <div className="members-card" style={{ marginBottom: 20 }}>
              <div className="members-header">Member Balances</div>
              {optimizeResult.memberBalances.map((mb) => (
                <div className="member-row" key={mb.userId}>
                  <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                    {(mb.username?.[0] ?? '?').toUpperCase()}
                  </div>
                  <div className="member-name">{mb.username}</div>
                  <div className={`member-balance ${mb.balance >= 0 ? 'pos' : 'neg'}`}>
                    {mb.balance >= 0 ? '+' : '-'}₹{fmt(Math.abs(mb.balance))}
                  </div>
                </div>
              ))}
            </div>

            {/* Optimized Transactions */}
            <div className="transactions-card">
              <div
                className="members-header"
                style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}
              >
                Optimized Transactions ({optimizeResult.transactions.length})
              </div>
              {optimizeResult.transactions.map((tx, idx) => (
                <div className="tx-item" key={idx}>
                  <div className="tx-num">{idx + 1}</div>
                  <div className="tx-from">
                    <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {(tx.fromName?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div className="tx-name">{tx.fromName ?? `User ${tx.from}`}</div>
                  </div>
                  <div className="tx-arrow-wrap">
                    <div className="tx-line" />
                    <div className="tx-amount">₹{fmt(tx.amount)}</div>
                  </div>
                  <div className="tx-to">
                    <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {(tx.toName?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div className="tx-name">{tx.toName ?? `User ${tx.to}`}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Confirm / Done */}
            {confirmed ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 20,
                  background: 'var(--accent-50)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--accent-300)',
                }}
              >
                <CheckCircle size={24} color="var(--accent-600)" />
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    Settlements confirmed!
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
                    All optimized transactions have been recorded.
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => navigate(`/dashboard/groups/${selectedGroup}`)}
                >
                  Back to Group
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 20,
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    Confirm Settlements
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
                    Record these {optimizeResult.transactions.length} optimized transactions.
                  </div>
                </div>
                <button className="btn btn-success" onClick={handleConfirm} disabled={confirming}>
                  {confirming ? 'Confirming...' : 'Confirm & Record'}
                </button>
              </div>
            )}
          </>
        )}

        {!selectedGroup && !loading && (
          <div className="empty-state">
            <Zap size={48} className="empty-icon" />
            <div className="empty-title">Select a group to optimize settlements</div>
            <div className="empty-sub">
              The min-cash-flow algorithm will find the fewest transactions needed to settle all debts.
            </div>
          </div>
        )}
      </div>
    </>
  )
}
