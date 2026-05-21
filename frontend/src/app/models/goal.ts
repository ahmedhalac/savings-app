export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  deadline: string | null;
  createdAt: string;
  savedAmount?: number;
  percentComplete?: number;
  projectedCompletionDate?: string | null;
}
