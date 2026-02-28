import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  groupsApi,
  expensesApi,
  type Group,
  type Expense,
  type Balance,
} from '../../services/api'
import { useAuth } from '../../context/useAuth'
import {
  ArrowLeft,
  Plus,
  Zap,
  UserPlus,
  Trash2,
  Search,
} from 'lucide-react'
import AddExpenseModal from './AddExpenseModal'

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const groupId = Number(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const myId = user?.userId

  const [group, setGroup] = useState<Group | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [balances, setBalances] = useState<Balance[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMsg, setInviteMsg] = useState('')

  const loadData = useCallback(async () => {
    try {
      const [grpRes, expRes, balRes] = await Promise.all([
        groupsApi.getById(groupId),
        expensesApi.getAll(groupId, page, 20),
        groupsApi.getBalances(groupId),
      ])
      setGroup(grpRes.group)
      setExpenses(expRes.expenses)
      setTotalPages(expRes.totalPages)
      setBalances(balRes.balances)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [groupId, page])

  useEffect(() => {
    setLoading(true)
    loadData()
  }, [loadData])

  const handleDelete = async (expenseId: number) => {
    if (!confirm('Delete this expense?')) return
    try {
      await expensesApi.delete(expenseId)
      await loadData()
    } catch {
      // ignore
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return
    setInviteMsg('')
    try {
      const res = await groupsApi.invite(groupId, inviteEmail.trim())
      setInviteMsg(res.message)
      setInviteEmail('')
      await loadData()
    } catch (err: unknown) {
      const e = err as { message?: string }
      setInviteMsg(e.message ?? 'Failed to invite')
    }
  }

  const fmt = (n: number) =>
    Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const myBalance = balances.find((b) => b.user.userId === myId)?.balance ?? 0
  const myTotalPaid = expenses
    .filter((e) => e.paidBy === myId)
    .reduce((s, e) => s + Number(e.amount), 0)
  const myTotalShare = expenses.reduce((s, e) => {
    const split = e.splits?.find((sp) => sp.userId === myId)
    return s + (split ? Number(split.shareAmount) : 0)
  }, 0)

  const filteredExpenses = search
    ? expenses.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
    : expenses

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <>
        <div className="topbar">
          <div className="topbar-title">Loading...</div>
        </div>
        <div className="page-body">
          <div className="loading-container">
            <div className="spinner" />
          </div>
        </div>
      </>
    )
  }

  if (!group) {
    return (
      <>
        <div className="topbar">
          <div className="topbar-title">Group Not Found</div>
        </div>
        <div className="page-body">
          <div className="empty-state">
            <div className="empty-title">Group not found</div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/groups')}>
              Back to Groups
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="topbar">
        <span
          className="topbar-breadcrumb"
          onClick={() => navigate('/dashboard/groups')}
        >
          <ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Groups /
        </span>
        <div className="topbar-title" style={{ flex: 1, paddingLeft: 8 }}>
          {group.groupName}
        </div>
        <div className="topbar-actions">
          <button
            className="btn btn-success btn-sm"
            onClick={() => navigate(`/dashboard/settle?group=${groupId}`)}
          >
            <Zap size={14} /> Settle Up
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddExpense(true)}>
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </div>

      <div className="page-body" style={{ position: 'relative' }}>
        <div className="detail-layout">
          {/* Expense Table */}
          <div>
            <div className="table-wrap">
              <div className="table-toolbar">
                <div className="table-title">
                  Expenses{' '}
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>
                    ({expenses.length})
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <Search
                      size={14}
                      style={{
                        position: 'absolute',
                        left: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                      }}
                    />
                    <input
                      className="input-field"
                      style={{ width: 180, padding: '7px 12px 7px 30px', fontSize: 13 }}
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {filteredExpenses.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 20px' }}>
                  <div className="empty-title">No expenses yet</div>
                  <div className="empty-sub">Add your first expense to get started.</div>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAddExpense(true)}>
                    <Plus size={14} /> Add Expense
                  </button>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Expense</th>
                      <th>Paid By</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Your Share</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((exp) => {
                      const isPayer = exp.paidBy === myId
                      const mySplit = exp.splits?.find((s) => s.userId === myId)
                      const myShare = mySplit ? Number(mySplit.shareAmount) : 0
                      const myNet = isPayer ? Number(exp.amount) - myShare : -myShare

                      return (
                        <tr key={exp.expenseId}>
                          <td>
                            <div className="expense-title">{exp.title}</div>
                            {exp.description && (
                              <div className="expense-desc">{exp.description}</div>
                            )}
                          </td>
                          <td>
                            <div className="expense-paid-by">
                              <div className="tiny-avatar">
                                {(exp.payer?.username?.[0] ?? '?').toUpperCase()}
                              </div>
                              {isPayer ? 'You' : exp.payer?.username ?? 'Unknown'}
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                            {formatDate(exp.createdAt)}
                          </td>
                          <td>
                            <div className="amount-cell">₹{fmt(Number(exp.amount))}</div>
                          </td>
                          <td>
                            <div
                              className="amount-cell"
                              style={{
                                color: myNet > 0 ? 'var(--accent-600)' : myNet < 0 ? 'var(--danger-500)' : undefined,
                              }}
                            >
                              {myNet >= 0 ? '+' : '-'}₹{fmt(Math.abs(myNet))}
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                myNet < 0 ? 'badge-owes' : myNet > 0 ? 'badge-gets' : 'badge-settled'
                              }`}
                            >
                              {myNet < 0 ? 'Owes' : myNet > 0 ? 'Gets Back' : 'Settled'}
                            </span>
                          </td>
                          <td>
                            {isPayer && (
                              <button
                                className="icon-btn"
                                style={{ width: 28, height: 28 }}
                                onClick={() => handleDelete(exp.expenseId)}
                                title="Delete expense"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '14px 20px',
                    borderTop: '1px solid var(--border-light)',
                  }}
                >
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </button>
                  <span
                    style={{
                      fontSize: 13,
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Members Card */}
            <div className="members-card">
              <div
                className="members-header"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span>Members ({group.memberships.length})</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowInvite(!showInvite)}>
                  <UserPlus size={14} />
                </button>
              </div>

              {showInvite && (
                <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      className="input-field"
                      style={{ flex: 1, fontSize: 13, padding: '6px 10px' }}
                      placeholder="Email to invite..."
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                    />
                    <button className="btn btn-primary btn-sm" onClick={handleInvite}>
                      Invite
                    </button>
                  </div>
                  {inviteMsg && (
                    <div style={{ fontSize: 12, marginTop: 6, color: 'var(--text-muted)' }}>
                      {inviteMsg}
                    </div>
                  )}
                </div>
              )}

              {balances.map((b) => {
                const isMe = b.user.userId === myId
                return (
                  <div className="member-row" key={b.user.userId}>
                    <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {(b.user.username?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div className="member-name">{isMe ? 'You' : b.user.username}</div>
                    <div className={`member-balance ${b.balance >= 0 ? 'pos' : 'neg'}`}>
                      {b.balance >= 0 ? '+' : '-'}₹{fmt(Math.abs(b.balance))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Balance Card */}
            <div className="balance-card">
              <div className="balance-card-header">
                Group Summary
                <span className="badge badge-primary" style={{ fontSize: 11 }}>
                  Active
                </span>
              </div>
              <div className="balance-item">
                <span>Total Expenses</span>
                <strong>₹{fmt(totalExpenses)}</strong>
              </div>
              <div className="balance-item">
                <span>Your Total Share</span>
                <strong>₹{fmt(myTotalShare)}</strong>
              </div>
              <div className="balance-item">
                <span>You Paid</span>
                <strong style={{ color: 'var(--accent-600)' }}>₹{fmt(myTotalPaid)}</strong>
              </div>
              <div className="balance-item">
                <span>Net Balance</span>
                <strong
                  style={{
                    color: myBalance >= 0 ? 'var(--accent-600)' : 'var(--danger-500)',
                  }}
                >
                  {myBalance >= 0 ? '+' : '-'}₹{fmt(Math.abs(myBalance))}
                </strong>
              </div>
              <div style={{ padding: '14px 20px' }}>
                <button
                  className="btn btn-success"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => navigate(`/dashboard/settle?group=${groupId}`)}
                >
                  <Zap size={14} /> Settle Up Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpenseModal
          groupId={groupId}
          members={group.memberships}
          onClose={() => setShowAddExpense(false)}
          onAdded={() => {
            setShowAddExpense(false)
            loadData()
          }}
        />
      )}
    </>
  )
}
