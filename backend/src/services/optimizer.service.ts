export interface Transaction {
  from: number   // userId who pays
  to: number     // userId who receives
  amount: number // rounded to 2 decimals
}

export interface MCFResult {
  transactions: Transaction[]
  totalTransactions: number
  naiveTransactions: number
  transactionsSaved: number
  reductionPercent: number
}

// Greedy heuristic for Minimum Cash Flow problem. Not guaranteed to be optimal, but efficient and often good in practice.
export function minimumCashFlow(balances: Map<number, number>): MCFResult {
  // Separate into creditors (positive) and debtors (negative)
  const creditors: { userId: number; amount: number }[] = []
  const debtors: { userId: number; amount: number }[] = []

  for (const [userId, balance] of balances) {
    const rounded = Math.round(balance * 100) / 100
    if (rounded > 0) {
      creditors.push({ userId, amount: rounded })
    } else if (rounded < 0) {
      debtors.push({ userId, amount: Math.abs(rounded) })
    }
    // balance === 0 → already settled, skip
  }

  // Count naive transactions: every debtor pays every creditor they might owe
  // Upper bound = debtors.length × creditors.length, but a tighter estimate
  // is the number of directed edges in the original debt graph. We use the
  // simple formula: max(creditors, debtors) as the theoretical naive count
  // when each debtor must separately pay each creditor. For display purposes,
  // we use (#creditors + #debtors - 1) as the worst-case naive approach.
  const naiveTransactions = creditors.length + debtors.length > 0
    ? creditors.length * debtors.length
    : 0

  const transactions: Transaction[] = []

  // Sort descending by amount for greedy matching
  creditors.sort((a, b) => b.amount - a.amount)
  debtors.sort((a, b) => b.amount - a.amount)

  let ci = 0
  let di = 0

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci]
    const debtor = debtors[di]

    const settleAmount = Math.round(Math.min(creditor.amount, debtor.amount) * 100) / 100

    if (settleAmount > 0) {
      transactions.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: settleAmount,
      })
    }

    creditor.amount = Math.round((creditor.amount - settleAmount) * 100) / 100
    debtor.amount = Math.round((debtor.amount - settleAmount) * 100) / 100

    if (creditor.amount === 0) ci++
    if (debtor.amount === 0) di++
  }

  const totalTransactions = transactions.length
  const transactionsSaved = Math.max(0, naiveTransactions - totalTransactions)
  const reductionPercent = naiveTransactions > 0
    ? Math.round((transactionsSaved / naiveTransactions) * 10000) / 100
    : 0

  return {
    transactions,
    totalTransactions,
    naiveTransactions,
    transactionsSaved,
    reductionPercent,
  }
}

// Helper to convert list of expenses into a directed graph of debts for MCF input
export interface DebtEdge {
  from: number
  to: number
  amount: number
}

export function buildDebtGraph(
  expenses: { paidBy: number; splits: { userId: number; shareAmount: number }[] }[],
): DebtEdge[] {
  // Aggregate directed debts: debtorId → creditorId → total
  const edgeMap = new Map<string, { from: number; to: number; amount: number }>()

  for (const expense of expenses) {
    for (const split of expense.splits) {
      if (split.userId === expense.paidBy) continue // payer doesn't owe themselves
      const key = `${split.userId}->${expense.paidBy}`
      const existing = edgeMap.get(key)
      if (existing) {
        existing.amount += split.shareAmount
      } else {
        edgeMap.set(key, { from: split.userId, to: expense.paidBy, amount: split.shareAmount })
      }
    }
  }

  return Array.from(edgeMap.values()).map(e => ({
    ...e,
    amount: Math.round(e.amount * 100) / 100,
  }))
}