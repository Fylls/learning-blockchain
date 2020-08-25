const ChainUtil = require("../chain-util")

class Transaction {
  constructor() {
    this.id = ChainUtil.id()
    this.input = null // How much person A is giving
    this.outputs = [] // updated person A & person B wallets
  }

  // Consider the case where an individual wants to create another transaction in a short timeframe.
  // We could easily create an entirely new transaction object to represent the new exchange but in
  // this case the input would virtually be the same between the original and new transaction.
  // So rather than creating an entirely new transaction object with a whole new ID, we can optimize
  // the process: we could update the original transaction with the new output to represent the new exchange.
  // Meaning there is one transaction object that consent currency to move from one individual to multiple outputs
  // We will resign the transaction to update the input of the new signature.
  // Likewise the output will subtract the sum total of all the outputs.

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(
      output => output.address === senderWallet.publicKey
    )

    if (amount > senderOutput.amount) {
      return console.log(`Amount ${amount} exceeds balance`)
    }

    senderOutput.amount = senderOutput.amount - amount
    this.outputs.push({ amount, address: recipient })
    Transaction.signTransaction(this, senderWallet)

    return this
  }

  // Checking how much currency a sender has after the transaction

  static newTransaction(senderWallet, recipient, amount) {
    const transaction = new this()

    if (amount > senderWallet.balance) {
      return console.log(`Amount ${amount} exceeds balance`)
    }

    transaction.outputs.push(
      ...[
        {
          amount: senderWallet.balance - amount,
          address: senderWallet.publicKey,
        },
        { amount: amount, address: recipient },
      ]
    )

    Transaction.signTransaction(transaction, senderWallet)

    return transaction
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    }
  }

  static verifyTransaction(transaction) {
    // ChainUtil.verifySignature ( ... )
    // 1)publicKey    2)signature    3)dataHash

    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs) // data that we want to verify
    )
  }
}

module.exports = Transaction
