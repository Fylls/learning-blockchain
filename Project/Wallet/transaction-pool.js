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
}

module.exports = TransactionPool
