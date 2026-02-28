/* ─────────────────────────────────────────────
   Lightweight fetch wrapper for the SpliX API
   ───────────────────────────────────────────── */

const API_BASE = 'http://localhost:3000/api'

/* ── token helpers ── */
export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken')
}
export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken')
}
export function setTokens(access: string, refresh: string) {
  localStorage.setItem('accessToken', access)
  localStorage.setItem('refreshToken', refresh)
}
export function clearTokens() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

/* ── generic request helper ── */
interface ApiError {
  message: string
  status: number
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  // Try to refresh once if 401
  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAccessToken()}`
      const retry = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })
      if (!retry.ok) {
        const err = await retry.json().catch(() => ({ message: 'Request failed' }))
        throw { message: err.message || 'Request failed', status: retry.status } as ApiError
      }
      return retry.json() as Promise<T>
    } else {
      clearTokens()
      throw { message: 'Session expired, please login again', status: 401 } as ApiError
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }))
    throw { message: err.message || 'Request failed', status: res.status } as ApiError
  }

  return res.json() as Promise<T>
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const refreshToken = getRefreshToken()
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return false
    const data = await res.json()
    localStorage.setItem('accessToken', data.accessToken)
    return true
  } catch {
    return false
  }
}

/* ── Shared Types ── */
export interface User {
  userId: number
  username: string
  email: string
  phoneNumber?: string | null
  profileImg?: string | null
  createdAt?: string
}

export interface GroupMember {
  membershipId: number
  userId: number
  groupId: number
  role: string
  isActive: boolean
  user: Pick<User, 'userId' | 'username' | 'email' | 'profileImg'>
}

export interface Group {
  groupId: number
  groupName: string
  createdBy: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  memberships: GroupMember[]
  _count?: { expenses: number }
  expenses?: Expense[]
}

export interface ExpenseSplit {
  splitId: number
  expenseId: number
  userId: number
  shareAmount: number
  user?: Pick<User, 'userId' | 'username'>
}

export interface Expense {
  expenseId: number
  groupId: number
  paidBy: number
  title: string
  description?: string | null
  amount: number
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  payer?: Pick<User, 'userId' | 'username' | 'email'>
  splits?: ExpenseSplit[]
}

export interface Balance {
  user: Pick<User, 'userId' | 'username' | 'email'>
  balance: number
  status: 'gets back' | 'owes' | 'settled'
}

export interface Settlement {
  settlementId: number
  groupId: number
  paidBy: number
  paidTo: number
  amount: number
  isCompleted: boolean
  createdAt: string
  payer?: Pick<User, 'userId' | 'username' | 'email'>
  payee?: Pick<User, 'userId' | 'username' | 'email'>
}

export interface PersonalExpense {
  personalExpenseId: number
  userId: number
  title: string
  description?: string | null
  amount: number
  category?: string | null
  createdAt: string
}

export interface OptimizedTransaction {
  from: number
  fromName?: string
  to: number
  toName?: string
  amount: number
}

export interface OptimizeResult {
  groupId: number
  memberBalances: { userId: number; username: string; balance: number }[]
  beforeGraph: { from: number; to: number; amount: number }[]
  afterGraph: OptimizedTransaction[]
  optimization: { before: number; after: number; saved: number; percentSaved: number }
  transactions: OptimizedTransaction[]
}

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

/* ── Auth API ── */
export const authApi = {
  register(data: {
    username: string
    email: string
    password: string
    phoneNumber?: string
  }): Promise<AuthResponse> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  login(data: { email: string; password: string }): Promise<AuthResponse> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  getMe(): Promise<{ user: User }> {
    return request('/auth/me')
  },

  refresh(): Promise<{ accessToken: string }> {
    return request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    })
  },
}

/* ── Groups API ── */
export const groupsApi = {
  create(groupName: string) {
    return request<{ group: Group }>('/groups', {
      method: 'POST',
      body: JSON.stringify({ groupName }),
    })
  },

  getMyGroups() {
    return request<{ groups: Group[] }>('/groups')
  },

  getById(id: number) {
    return request<{ group: Group }>(`/groups/${id}`)
  },

  invite(groupId: number, email: string) {
    return request<{ message: string; member: GroupMember }>(`/groups/${groupId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  getBalances(groupId: number) {
    return request<{ balances: Balance[] }>(`/groups/${groupId}/balances`)
  },

  getMembers(groupId: number) {
    return request<{ members: { membershipId: number; role: string; joinedAt: string; user: Pick<User, 'userId' | 'username' | 'email' | 'profileImg'> }[] }>(
      `/groups/${groupId}/members`,
    )
  },

  removeMember(groupId: number, userId: number) {
    return request<{ message: string }>(`/groups/${groupId}/members/${userId}`, {
      method: 'DELETE',
    })
  },
}

/* ── Expenses API ── */
export const expensesApi = {
  add(groupId: number, data: {
    title: string
    description?: string
    amount: number
    splitType: string
    splits?: { userId: number; percentage?: number; amount?: number; shareAmount?: number }[]
  }) {
    return request<{ expense: Expense }>(`/groups/${groupId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  getAll(groupId: number, page = 1, limit = 10) {
    return request<{ expenses: Expense[]; total: number; page: number; totalPages: number }>(
      `/groups/${groupId}/expenses?page=${page}&limit=${limit}`,
    )
  },

  edit(expenseId: number, data: { title?: string; description?: string; amount?: number }) {
    return request<{ expense: Expense }>(`/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete(expenseId: number) {
    return request<{ message: string }>(`/expenses/${expenseId}`, {
      method: 'DELETE',
    })
  },
}

/* ── Settlements API ── */
export const settlementsApi = {
  optimize(groupId: number) {
    return request<OptimizeResult>(`/groups/${groupId}/settle/optimize`)
  },

  confirm(groupId: number, transactions: OptimizedTransaction[]) {
    return request<{ message: string; settlements: Settlement[] }>(`/groups/${groupId}/settle/confirm`, {
      method: 'POST',
      body: JSON.stringify({ transactions }),
    })
  },

  complete(settlementId: number) {
    return request<{ message: string; settlement: Settlement }>(`/settlements/${settlementId}/complete`, {
      method: 'PUT',
    })
  },

  history(groupId: number) {
    return request<{ settlements: Settlement[] }>(`/groups/${groupId}/settle/history`)
  },
}

/* -- Analytics API -- */
export interface AnalyticsData {
  summary: {
    totalExpenses: number
    totalSpent: number
    totalMembers: number
    completedSettlements: number
    pendingSettlements: number
  }
  spendingByPerson: { name: string; amount: number }[]
  spendingTimeline: { date: string; amount: number }[]
  perPersonBreakdown: {
    user: Pick<User, 'userId' | 'username'>
    totalPaid: number
    totalOwes: number
    netBalance: number
  }[]
}

export const analyticsApi = {
  getGroupAnalytics(groupId: number) {
    return request<AnalyticsData>(`/groups/${groupId}/analytics`)
  },
}

/* -- Personal Expenses API -- */
export const personalApi = {
  add(data: { title: string; description?: string; amount: number; category?: string }) {
    return request<{ expense: PersonalExpense }>('/personal', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  getAll(page = 1, limit = 20) {
    return request<{ expenses: PersonalExpense[]; total: number; page: number; totalPages: number }>(
      `/personal?page=${page}&limit=${limit}`,
    )
  },

  update(id: number, data: { title?: string; description?: string; amount?: number; category?: string }) {
    return request<{ expense: PersonalExpense }>(`/personal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete(id: number) {
    return request<{ message: string }>(`/personal/${id}`, {
      method: 'DELETE',
    })
  },
}
