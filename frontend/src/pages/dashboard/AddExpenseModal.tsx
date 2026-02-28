import { useState } from 'react'
import { expensesApi, type GroupMember } from '../../services/api'
import { useAuth } from '../../context/useAuth'
import { X } from 'lucide-react'

interface Props {
  groupId: number
  members: GroupMember[]
  onClose: () => void
  onAdded: () => void
}

type SplitType = 'equal' | 'exact' | 'percentage'

export default function AddExpenseModal({ groupId, members, onClose, onAdded }: Props) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [splitType, setSplitType] = useState<SplitType>('equal')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // For exact/percentage splits
  const [splitValues, setSplitValues] = useState<Record<number, string>>({})

  const parsedAmount = parseFloat(amount.replace(/,/g, '')) || 0
  const memberCount = members.length

  const equalShare = memberCount > 0 ? parsedAmount / memberCount : 0

  const fmt = (n: number) =>
    n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

  const updateSplitValue = (userId: number, val: string) => {
    setSplitValues((prev) => ({ ...prev, [userId]: val }))
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (parsedAmount <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    setError('')
    setSubmitting(true)

    try {
      let splits: { userId: number; percentage?: number; amount?: number; shareAmount?: number }[] | undefined

      if (splitType === 'exact') {
        splits = members.map((m) => ({
          userId: m.userId,
          amount: parseFloat(splitValues[m.userId] || '0'),
        }))
      } else if (splitType === 'percentage') {
        splits = members.map((m) => ({
          userId: m.userId,
          percentage: parseFloat(splitValues[m.userId] || '0'),
        }))
      }

      await expensesApi.add(groupId, {
        title: title.trim(),
        description: description.trim() || undefined,
        amount: parsedAmount,
        splitType,
        splits,
      })
      onAdded()
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message ?? 'Failed to add expense')
    } finally {
      setSubmitting(false)
    }
  }

  // Validate split sums
  let splitTotal = 0
  let splitValid = true
  if (splitType === 'exact') {
    splitTotal = members.reduce((s, m) => s + (parseFloat(splitValues[m.userId] || '0') || 0), 0)
    splitValid = Math.abs(splitTotal - parsedAmount) < 0.01
  } else if (splitType === 'percentage') {
    splitTotal = members.reduce((s, m) => s + (parseFloat(splitValues[m.userId] || '0') || 0), 0)
    splitValid = Math.abs(splitTotal - 100) < 0.01
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div className="modal-title">Add Expense</div>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          {/* Amount Hero */}
          <div className="amount-hero">
            <div className="amount-hero-label">Total Amount (₹)</div>
            <input
              className="amount-hero-input"
              type="text"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>

          {/* Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div className="input-wrapper" style={{ marginBottom: 0 }}>
              <label className="input-label">Description</label>
              <input
                className="input-field"
                placeholder="What's it for?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="input-wrapper" style={{ marginBottom: 0 }}>
              <label className="input-label">Notes (optional)</label>
              <input
                className="input-field"
                placeholder="Any notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Split Tabs */}
          <div className="input-label" style={{ marginBottom: 8 }}>
            Split Type
          </div>
          <div className="split-tabs">
            {(['equal', 'exact', 'percentage'] as SplitType[]).map((t) => (
              <button
                key={t}
                className={`split-tab${splitType === t ? ' active' : ''}`}
                onClick={() => setSplitType(t)}
              >
                {t === 'equal' ? 'Equal' : t === 'exact' ? 'Exact Amount' : 'Percentage'}
              </button>
            ))}
          </div>

          {/* Split Rows */}
          <div
            style={{
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              padding: 14,
            }}
          >
            {members.map((m) => {
              const isMe = m.userId === user?.userId
              return (
                <div className="split-row" key={m.userId}>
                  <div
                    className="user-avatar"
                    style={{ width: 28, height: 28, fontSize: 11, flexShrink: 0 }}
                  >
                    {(m.user.username?.[0] ?? '?').toUpperCase()}
                  </div>
                  <div style={{ flex: 1, fontSize: '13.5px', fontWeight: 500 }}>
                    {isMe ? `${m.user.username} (You)` : m.user.username}
                  </div>
                  {splitType === 'equal' ? (
                    <div className="split-share">₹{fmt(equalShare)}</div>
                  ) : splitType === 'exact' ? (
                    <input
                      className="input-field"
                      style={{ width: 90, padding: '4px 8px', fontSize: 13, textAlign: 'right' }}
                      placeholder="₹0"
                      value={splitValues[m.userId] || ''}
                      onChange={(e) => updateSplitValue(m.userId, e.target.value)}
                    />
                  ) : (
                    <input
                      className="input-field"
                      style={{ width: 70, padding: '4px 8px', fontSize: 13, textAlign: 'right' }}
                      placeholder="0%"
                      value={splitValues[m.userId] || ''}
                      onChange={(e) => updateSplitValue(m.userId, e.target.value)}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Validation message */}
          {parsedAmount > 0 && splitType === 'equal' && (
            <div
              style={{
                marginTop: 10,
                padding: '8px 14px',
                background: 'var(--accent-50)',
                borderRadius: 'var(--radius-md)',
                fontSize: 12,
                color: 'var(--accent-700)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Split is balanced — ₹{fmt(parsedAmount)} / {memberCount} members = ₹{fmt(equalShare)}{' '}
              each
            </div>
          )}

          {splitType !== 'equal' && parsedAmount > 0 && (
            <div
              style={{
                marginTop: 10,
                padding: '8px 14px',
                background: splitValid ? 'var(--accent-50)' : 'var(--danger-50)',
                borderRadius: 'var(--radius-md)',
                fontSize: 12,
                color: splitValid ? 'var(--accent-700)' : 'var(--danger-600)',
              }}
            >
              {splitType === 'exact'
                ? `Total: ₹${fmt(splitTotal)} / ₹${fmt(parsedAmount)} ${splitValid ? '— Balanced' : '— Does not match'}`
                : `Total: ${fmt(splitTotal)}% / 100% ${splitValid ? '— Balanced' : '— Does not add up'}`}
            </div>
          )}

          {error && (
            <div style={{ color: 'var(--danger-500)', fontSize: 13, marginTop: 10 }}>{error}</div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting || (splitType !== 'equal' && !splitValid)}
          >
            {submitting ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </div>
    </div>
  )
}
