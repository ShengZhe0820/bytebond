import {AgreementStatus, TraderLevels, TraderStatus} from "./enum";
import {Agreement} from "./types";

export const Demo_Eligible_Trader = [
  {
    'tA': "0.0.1232478",
    'level': TraderLevels.ELITE,
    'roi': "20%",
    'wR': '50%',
    'mDD': '20%',
    'status': TraderStatus.TAKEN
  },
  {
    'tA': "0.0.1459123",
    'level': TraderLevels.ADVANCED,
    'roi': "40%",
    'wR': '45%',
    'mDD': '10%',
    'status': TraderStatus.HIRED
  },
  {
    'tA': "0.0.1423428",
    'level': TraderLevels.NOVICE,
    'roi': "5%",
    'wR': '70%',
    'mDD': '2%',
    'status': TraderStatus.VERIFIED
  }
]

export const Demo_Agreement = [
  {
    'tA': "0.0.1459123",
    'cA': '0xadkj4kfgoecwes1f',
    'uPL': "10%",
    'rPL': "15%",
    'nT': 5,
    status: AgreementStatus.ACTIVE
  }
]

export const Evaluation_Requirement = [
  "Execute a minimum of 50 trades. (0/50)"
  , "Demonstrate consistent profitability month over month. (0/3)",
  "Maintain a maximum drawdown of less than 10%. (0/3)",
  "Diversify your trades across 5 asset classes. (0/5)"
]
