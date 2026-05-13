export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
}

export interface ExpenseData {
  date: string;
  description: string;
  amount: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}