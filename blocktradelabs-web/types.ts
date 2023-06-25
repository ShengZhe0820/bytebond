import {AgreementStatus, TraderStatus} from "./enum";

export interface TraderLevel {
  id: number;
  name: string;
  accountSize: number,
  maximumTotalLoss: number,
  requirements: string[]
}

export interface Trader {
  'tA': string,
  'level': TraderLevel,
  'roi': string,
  'wR': string,
  'mDD': string,
  'status': TraderStatus
}

export interface Agreement {
  'tA': string,
  'cA': string,
  'uPL': string,
  'rPL': string,
  nT:number,
  status: AgreementStatus
}

export interface TradeRecord {
  id: string,
  fSym: string,
  tSym: string,
  amt: number,
  date: string
}
