export interface Goal {
  id: number;
  accountId: number;
  name: string;
  targetAmount: number;
  deadline: string | null;
  createdAt: string;
}
