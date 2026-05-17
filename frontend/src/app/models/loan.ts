export interface Loan {
  id: number;
  borrowerName: string;
  amount: number;
  createdAt: string;
}

export interface LoansResponse {
  loans: Loan[];
  totalLoaned: number;
}
