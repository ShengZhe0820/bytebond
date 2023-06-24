export enum AccountSize {
  Novice = 1000,
  INTERMEDIATE = 5000,
  ADVANCED = 20000,
  ELITE = 50000,
  MASTER = 100000,
}

export const TraderLevels = {
  NOVICE: {
    id: 1,
    name: 'Novice Trader',
    accountSize: AccountSize.Novice,
    maximumTotalLoss: 100,
    requirements: []
  },
  INTERMEDIATE: {
    id: 2,
    name: 'Intermediate Trader',
    'accountSize': AccountSize.INTERMEDIATE,
    tradingDays: 30,
    maximumTotalLoss: 100,
    requirements: [
      'Complete a minimum of 30 trading days',
      'Achieve a positive net profit over the last 30 trading days.',
      'No violation of the daily loss limit for the last 30 trading days.'
    ]
  },
  ADVANCED: {
    id: 3,
    name: 'Advanced Trader',
    'accountSize': AccountSize.ADVANCED,
    tradingDays: 30,
    maximumTotalLoss: 100,
    requirements: [
      'Complete a minimum of 60 trading days',
      'Achieve a positive net profit for two consecutive months.',
      'Maintain a maximum drawdown of less than 10% for the last 60 trading days.'

    ]
  },
  ELITE: {
    id: 4,
    name: 'Elite Trader',
    'accountSize': AccountSize.ELITE,
    tradingDays: 30,
    maximumTotalLoss: 100,
    requirements: [
      'Complete a minimum of 90 trading days',
      'Achieve a positive net profit for three consecutive months.',
      'Maintain a maximum drawdown of less than 10% for the last 90 trading days.',
      'Successfully avoid hitting the daily loss limit for three consecutive months.'
    ]
  },
  MASTER: {
    id: 5,
    name: 'Master Trader',
    'accountSize': AccountSize.MASTER,
    tradingDays: 30,
    maximumTotalLoss: 100,
    requirements: [
      'Complete a minimum of 120 trading days',
      'Achieve a positive net profit for four consecutive months.',
      'Maintain a maximum drawdown of less than 10% for the last 120 trading days.',
      'Successfully avoid hitting the daily loss limit for four consecutive months.',
      'Achieve a minimum Sharpe Ratio (a measure of risk-adjusted return) of 1.0.'
    ]
  }
}
export enum AccStatus {
  FUNDER = 'funder',
  QUALIFIED = 'qualified',
  EVALUATING = 'evaluation',
  NEW= 'new'
}


export enum TraderStatus {
  TAKEN = 'Taken',
  HIRED = 'Hired',
  VERIFIED = 'Verified'
}

export enum AgreementStatus {
  ACTIVE = 'Active',
  TERMINATED = 'Terminated'
}


