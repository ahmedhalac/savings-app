export interface Transaction {
  id: number;
  accountId: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  note: string | null;
  createdAt: string;
}
