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
}

module.exports = TransactionPool
