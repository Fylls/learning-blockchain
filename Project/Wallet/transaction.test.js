const Transaction = require("./transaction")
const Wallet = require("./index")

describe("Transaction", () => {
  let trans, wallet, recipient, amount

  beforeEach(() => {
    wallet = new Wallet()
    amount = 50
    recipient = "r3c1p13nt" // ID
    trans = Transaction.newTransaction(wallet, recipient, amount)
  })

  it("outputs the `amount` subtracted to the recipient balance", () => {
    expect(
      trans.outputs.find(output => output.address === wallet.publicKey).amount
    ).toEqual(wallet.balance - amount)
  })

  it("outputs the `amount` added to the recipient balance", () => {
    expect(
      trans.outputs.find(output => output.address === recipient).amount
    ).toEqual(amount)
  })

  it("it inputs the balance of the wallet", () => {
    expect(trans.input.amount).toEqual(wallet.balance)
  })

  it("it validates a valid transaction ", () => {
    expect(Transaction.verifyTransaction(trans)).toBe(true)
  })

  it("it invalidates a corrupted transaction ", () => {
    trans.outputs[0].amount = 50000

    expect(Transaction.verifyTransaction(trans)).toBe(false)
  })

  describe("transacting with an amount that exceeds the balance", () => {
    beforeEach(() => {
      amount = 5000
      trans = Transaction.newTransaction(wallet, recipient, amount)
    })

    it("does not create the transaction", () => {
      expect(trans).toEqual(undefined)
    })
  })

  describe("updating a transaction", () => {
    let nextAmount, nextRecipient
    beforeEach(() => {
      nextAmount = 20
      nextRecipient = "n3xt-4ddr355"
      trans = trans.update(wallet, nextRecipient, nextAmount)
    })

    it("subtracts the nextAmount from the sender's output", () => {
      expect(
        trans.outputs.find(output => output.address === wallet.publicKey).amount
      ).toEqual(wallet.balance - amount - nextAmount)
    })

    it("outputs an amount for the nextRecipient", () => {
      expect(
        trans.outputs.find(output => output.address === nextRecipient).amount
      ).toEqual(nextAmount)
    })
  })
})
