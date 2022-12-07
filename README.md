# README

## How to run the program

To run the program, you will need to have [Node.js](https://nodejs.org/) installed on your computer. Once you have Node.js installed, follow these steps:

1. Clone this repository to your local machine.
2. Open a terminal or command prompt, and navigate to the directory where you cloned the repository.
3. Install the necessary dependencies by running the following command:

```
npm install
```

4. Start the program by running the following command:

```
npm run start
```

## Design details

This program is a simple implementation of a blockchain in JavaScript, using the [NestJS](https://nestjs.com/) framework. The program allows users to add transactions to the blockchain, and automatically mines new blocks of transactions every 10 seconds.

The program has the following features:

- A `Transaction` class that represents a single transaction on the blockchain.
- A `Block` class that represents a block of transactions on the blockchain.
- An `AppService` class that manages the blockchain and transaction data, and automatically mines new blocks using a Cronjob.
- An `AppController` class that exposes the blockchain data and transaction functionality through a RESTful API.

## API documentation

The program will run on port 3000 by default and exposes the following endpoints:

- GET http://localhost:3000 This endpoint returns a simple message.
- GET http://localhost:3000/transactions: This endpoint returns a list of all transactions.
- GET http://localhost:3000/accounts: This endpoint returns a list of all accounts and their balances.
- GET http://localhost:3000/blocks: This endpoint returns a list of all blocks in the blockchain.
- POST http://localhost:3000: This endpoint is used to add a new transaction. The request body should be in the following format:

````
{
  "from": "howard",
  "to": "maicoin",
  "value": "20"
}
```
````
