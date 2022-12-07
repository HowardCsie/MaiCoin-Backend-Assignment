import { Controller, Get, Post, Body } from '@nestjs/common'
import { AppService } from './app.service'
import { Transaction } from './transaction'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('transactions')
  getTransactions(): Transaction[] {
    return this.appService.getTransactions()
  }

  @Get('accounts')
  getAccounts(): { [key: string]: string } {
    return this.appService.getAccounts()
  }

  @Get('blocks')
  getBlocks(): { [key: string]: string } {
    return this.appService.getBlocks()
  }

  @Post()
  addTransaction(
    @Body() body: { from: string; to: string; value: string }
  ): Transaction {
    return this.appService.addTransaction(body)
  }
}
