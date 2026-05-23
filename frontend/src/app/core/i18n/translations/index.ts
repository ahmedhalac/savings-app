export interface Translations {
  nav: {
    dashboard: string;
    transactions: string;
    goals: string;
    loans: string;
  };
  dashboard: {
    totalBalance: string;
    netAvailable: string;
    totalLoaned: string;
    accounts: string;
    noAccounts: string;
    addAccount: string;
    adding: string;
    accountName: string;
    accountType: string;
    savings: string;
    current: string;
    buffer: string;
    bufferInfo: string;
    createBuffer: string;
    noBuffer: string;
    cancel: string;
    deleteWarning: string;
    delete: string;
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
    saved: string;
    target: string;
    goalComplete: string;
    projectedDone: string;
    noDepositHistory: string;
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
  setup: {
    title: string;
    subtitle: string;
    accountName: string;
    accountType: string;
    savings: string;
    current: string;
    buffer: string;
    addAccount: string;
    remove: string;
    removeWarning: string;
    cancel: string;
    complete: string;
    completing: string;
  };
  toast: {
    error: string;
  };
  wakeup: {
    title: string;
    subtitle: string;
  };
}

export type Locale = 'en-US' | 'bs';
