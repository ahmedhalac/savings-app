export interface Translations {
  nav: {
    dashboard: string;
    transactions: string;
    goals: string;
    loans: string;
    ai: string;
  };
  dashboard: {
    totalBalance: string;
    netAvailable: string;
    totalLoaned: string;
    accounts: string;
    noAccounts: string;
  };
  transactions: {
    deposit: string;
    withdraw: string;
    account: string;
    amount: string;
    explanation: string;
    depositSuccess: string;
    withdrawSuccess: string;
    noTransactions: string;
    history: string;
    selectAccount: string;
    depositing: string;
    withdrawing: string;
  };
  goals: {
    goals: string;
    newGoal: string;
    noGoals: string;
    account: string;
    goalName: string;
    targetAmount: string;
    deadline: string;
    goalCreated: string;
    createGoal: string;
    due: string;
    created: string;
    delete: string;
    creating: string;
  };
  loans: {
    loans: string;
    newLoan: string;
    totalLoaned: string;
    noLoans: string;
    borrowerName: string;
    amount: string;
    loanRecorded: string;
    recordLoan: string;
    markReturned: string;
    recording: string;
  };
  ai: {
    title: string;
  };
}

export type Locale = 'en-US' | 'bs';
