import { Decimal } from 'decimal.js'
export interface Transaction {
  from: string
  to: string
  value: Decimal
  hash: string
  date: Date
}
