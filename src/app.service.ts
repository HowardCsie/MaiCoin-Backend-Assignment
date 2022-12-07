import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { Block } from './block'
import { Transaction } from './transaction'
import { createHash } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { Decimal } from 'decimal.js'

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)
  private readonly accounts: Map<string, Decimal>
  private readonly transactions: Map<string, Transaction>
  private readonly blocks: Map<number, Block>
  private readonly pendingTransactions: Transaction[]

  constructor() {
    this.accounts = new Map()
    this.transactions = new Map()
    this.blocks = new Map()
    this.pendingTransactions = []
  }

  addTransaction(body: {
    from: string
    to: string
    value: string
  }): Transaction {
    const transaction: Transaction = {
      from: body.from,
      to: body.to,
      value: new Decimal(body.value),
      date: new Date(),
      hash: '',
    }

    transaction.hash = createHash('sha256')
      .update(JSON.stringify(transaction))
      .digest('hex')

    this.pendingTransactions.push(transaction)
    return transaction
  }

  @Cron('*/10 * * * * *')
  private mineBlock() {
    if (this.pendingTransactions.length === 0) {
      this.logger.debug('No pending transactions')
      return
    }
    this.logger.debug('Mining block...')

    const transactions = this.pendingTransactions.splice(0, 100)
    const currentHeight = this.blocks.size
    const parentBlock = this.blocks.get(currentHeight)
    const block: Block = {
      height: currentHeight + 1,
      parentHash: parentBlock ? parentBlock.hash : '',
      transactions: transactions.map((tx) => tx.hash),
      hash: '',
    }

    block.hash = createHash('sha256')
      .update(JSON.stringify(block))
      .digest('hex')

    transactions.forEach((tx) => {
      this.logger.debug(tx)
      this.applyTransaction(tx)
      this.transactions.set(tx.hash, tx)
    })

    this.blocks.set(block.height, block)
    this.logger.debug(`Block ${block.hash} mined`)
  }

  private getAccountBalance(address: string): Decimal {
    if (!this.accounts.has(address)) {
      this.accounts.set(address, new Decimal(100))
    }
    return this.accounts.get(address)
  }

  private applyTransaction(transaction: Transaction): void {
    const fromBalance = this.getAccountBalance(transaction.from)
    const toBalance = this.getAccountBalance(transaction.to)

    if (fromBalance.lessThan(transaction.value)) {
      this.logger.error(
        `Account "${transaction.from}" does not have enough balance to complete the transaction`
      )
      return
    }
    this.accounts.set(transaction.from, fromBalance.sub(transaction.value))
    this.accounts.set(transaction.to, toBalance.add(transaction.value))
    this.logger.debug(
      `Account "${
        transaction.from
      }" balance: ${fromBalance} -> ${this.getAccountBalance(transaction.from)}`
    )
    this.logger.debug(
      `Account "${
        transaction.to
      }" balance: ${toBalance} -> ${this.getAccountBalance(transaction.to)}`
    )
  }

  getHello(): string {
    return 'Hello MaiCoin!'
  }

  getTransactions(): Transaction[] {
    return Array.from(this.transactions.values())
  }

  getAccounts(): { [key: string]: string } {
    const accounts = {}
    this.accounts.forEach((value, key) => {
      accounts[key] = value.toString()
    })
    return accounts
  }

  getBlocks(): { [key: string]: string } {
    const blocks = {}
    this.blocks.forEach((block) => {
      blocks[block.height] = block
    })
    return blocks
  }
}
