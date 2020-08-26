const TransactionPool = require("./transaction-pool")
const Transaction = require("./transaction")
const Wallet = require("./index")

describe("TransactionPool", () => {
  let tp, wallet, trans

  beforeEach(() => {
    tp = new TransactionPool()
    wallet = new Wallet()
    trans = wallet.createTransaction("r3c1p13nt", 30, tp)
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

  describe("Mixing valid and invalid transactions", () => {
    let validTransactions

    beforeEach(() => {
      validTransactions = [...tp.transactions]

      for (let i = 0; i < 6; i++) {
        wallet = new Wallet()
        trans = wallet.createTransaction("r4nd0m-4ddr355", 30, tp)

        if (i % 2 === 0) trans.input.amount = 99999
        else validTransactions.push(trans)
      }
    })

    it("shows a difference between valid and currupted transactions", () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(
        JSON.stringify(validTransactions)
      )
    })

    it("grabs valid transactions", () => {
      expect(tp.validTransactions()).toEqual(validTransactions)
    })
  })
})
