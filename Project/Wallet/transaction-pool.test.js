const TransactionPool = require("./transaction-pool")
const Transaction = require("./transaction")
const Wallet = require("./index")

describe("TransactionPool", () => {
  let tp, wallet, trans

  beforeEach(() => {
    tp = new TransactionPool()
    wallet = new Wallet()
    trans = Transaction.newTransaction(wallet, "r3c1p13nt", 30)
    tp.updateOrAddTransaction(trans)
  })

  it("adds a transaction to the pool", () => {
    expect(tp.transactions.find(t => t.id === trans.id)).toEqual(trans)
  })

  it("updates a transaction to the pool", () => {
    const oldTransaction = JSON.stringify(trans)
    const newTransaction = trans.update(wallet, "n3w-r3c1p13nt", 40)

    tp.updateOrAddTransaction(newTransaction)

    expect(
      JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))
    ).not.toEqual(oldTransaction)
  })
})
