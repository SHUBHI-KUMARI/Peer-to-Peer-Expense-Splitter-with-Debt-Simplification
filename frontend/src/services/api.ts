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

/* ── Auth API ── */
export interface User {
  userId: number
  username: string
  email: string
  phoneNumber?: string | null
  profileImg?: string | null
  createdAt?: string
}

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

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
    return request<{ group: unknown }>('/groups', {
      method: 'POST',
      body: JSON.stringify({ groupName }),
    })
  },

  getMyGroups() {
    return request<{ groups: unknown[] }>('/groups')
  },

  getById(id: number) {
    return request<{ group: unknown }>(`/groups/${id}`)
  },

  invite(groupId: number, email: string) {
    return request<{ message: string; member: unknown }>(`/groups/${groupId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  getBalances(groupId: number) {
    return request<{ balances: unknown[] }>(`/groups/${groupId}/balances`)
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
    return request<{ expense: unknown }>(`/groups/${groupId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  getAll(groupId: number, page = 1, limit = 10) {
    return request<{ expenses: unknown[]; total: number; page: number; totalPages: number }>(
      `/groups/${groupId}/expenses?page=${page}&limit=${limit}`,
    )
  },

  edit(expenseId: number, data: { title?: string; description?: string; amount?: number }) {
    return request<{ expense: unknown }>(`/expenses/${expenseId}`, {
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
