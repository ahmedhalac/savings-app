export interface Account {
  id: number;
  name: string;
  type: 'savings' | 'current';
  balance: number;
  createdAt: string;
}

export interface AccountsSummary {
  totalBalance: number;
}
