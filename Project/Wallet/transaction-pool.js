const Transaction = require("./transaction")

class TransactionPool {
  constructor() {
    this.transactions = []
  }

  updateOrAddTransaction(transaction) {
    let transactionWithId = this.transactions.find(t => t.id === transaction.id)

    if (transactionWithId) {
      const tIndex = this.transactions.indexOf(transactionWithId)
      this.transactions[tIndex] = transaction
    } else {
      this.transactions.push(transaction)
    }
  }

  existingTransaction(address) {
    return this.transactions.find(t => t.input.address === address)
  }

  validTransactions() {
    return this.transactions.filter(t => {
      const outputTotal = t.outputs.reduce((total, output) => {
        return total + output.amount
      }, 0)

      // check if transaction-data is correct
      if (t.input.amount !== outputTotal) {
        return console.log(`invalid transaction from ${t.input.address}`)
      }

      // verify each signature
      if (!Transaction.verifyTransaction(t)) {
        return console.log(`invalid signature from ${t.input.address}`)
      }
      return t
    })
  }

  clear() {
    this.transactions = []
  }
}

module.exports = TransactionPool
