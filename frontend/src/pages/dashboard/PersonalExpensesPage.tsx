import { useEffect, useState } from 'react'
import { personalApi, type PersonalExpense } from '../../services/api'
import { Plus, Trash2, X, Edit3, Wallet } from 'lucide-react'

// category options
const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']

export default function PersonalExpensesPage() {
  const [expenses, setExpenses] = useState<PersonalExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', description: '', amount: '', category: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await personalApi.getAll(page, 20)
      setExpenses(res.expenses)
      setTotalPages(res.totalPages)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page])

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.amount) return
    setSubmitting(true)
    setError('')
    try {
      if (editId) {
        await personalApi.update(editId, {
          title: form.title,
          description: form.description || undefined,
          amount: parseFloat(form.amount),
          category: form.category || undefined,
        })
      } else {
        await personalApi.add({
          title: form.title,
          description: form.description || undefined,
          amount: parseFloat(form.amount),
          category: form.category || undefined,
        })
      }
      setShowAdd(false)
      setEditId(null)
      setForm({ title: '', description: '', amount: '', category: '' })
      setLoading(true)
      load()
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message ?? 'Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this expense?')) return
    try {
      await personalApi.delete(id)
      load()
    } catch {
      // ignore
    }
  }

  const openEdit = (exp: PersonalExpense) => {
    setEditId(exp.personalExpenseId)
    setForm({
      title: exp.title,
      description: exp.description ?? '',
      amount: String(exp.amount),
      category: exp.category ?? '',
    })
    setShowAdd(true)
  }

  const fmt = (n: number) =>
    Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // compute totals
  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const categoryTotals: Record<string, number> = {}
  expenses.forEach(e => {
    const cat = e.category || 'Other'
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount)
  })

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Personal Expenses</div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" onClick={() => { setEditId(null); setForm({ title: '', description: '', amount: '', category: '' }); setShowAdd(true) }}>
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <>
            {/* stats row */}
            <div className="stats-row">
              <div className="stat-card owe">
                <div className="stat-label">
                  <span className="stat-dot" style={{ background: 'var(--primary-400)' }} />
                  Total Spent
                </div>
                <div className="stat-amount">₹{fmt(totalSpent)}</div>
                <div className="stat-sub">{expenses.length} expenses tracked</div>
              </div>
              {Object.entries(categoryTotals).slice(0, 2).map(([cat, amt]) => (
                <div className="stat-card net" key={cat}>
                  <div className="stat-label">
                    <span className="stat-dot" style={{ background: 'var(--accent-400)' }} />
                    {cat}
                  </div>
                  <div className="stat-amount">₹{fmt(amt)}</div>
                  <div className="stat-sub">{((amt / totalSpent) * 100).toFixed(0)}% of total</div>
                </div>
              ))}
            </div>

            <div className="table-wrap">
              <div className="table-toolbar">
                <div className="table-title">Expenses ({expenses.length})</div>
              </div>
              {expenses.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 20px' }}>
                  <Wallet size={48} className="empty-icon" />
                  <div className="empty-title">No personal expenses yet</div>
                  <div className="empty-sub">Track your personal spending to stay on budget.</div>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
                    <Plus size={14} /> Add Expense
                  </button>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(exp => (
                      <tr key={exp.personalExpenseId}>
                        <td>
                          <div className="expense-title">{exp.title}</div>
                          {exp.description && <div className="expense-desc">{exp.description}</div>}
                        </td>
                        <td>
                          <span className="badge badge-primary">{exp.category || 'Other'}</span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(exp.createdAt)}</td>
                        <td><div className="amount-cell">₹{fmt(Number(exp.amount))}</div></td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => openEdit(exp)} title="Edit">
                              <Edit3 size={13} />
                            </button>
                            <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => handleDelete(exp.personalExpenseId)} title="Delete">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--border-light)' }}>
                  <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Page {page} of {totalPages}</span>
                  <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editId ? 'Edit Expense' : 'Add Personal Expense'}</div>
              <button className="modal-close" onClick={() => setShowAdd(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="input-wrapper">
                <label className="input-label">Title</label>
                <input className="input-field" placeholder="e.g. Coffee" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} autoFocus />
              </div>
              <div className="input-wrapper" style={{ marginTop: 12 }}>
                <label className="input-label">Amount</label>
                <input className="input-field" type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="input-wrapper" style={{ marginTop: 12 }}>
                <label className="input-label">Category</label>
                <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="input-wrapper" style={{ marginTop: 12 }}>
                <label className="input-label">Description (optional)</label>
                <input className="input-field" placeholder="Notes..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              {error && <div style={{ color: 'var(--danger-500)', fontSize: 13, marginTop: 8 }}>{error}</div>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Saving...' : editId ? 'Update' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
