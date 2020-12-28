const { INITIAL_BALANCE } = require("../config")

const ChainUtil = require("../chain-util")
const Transaction = require("./transaction")

// With this ChainUtil module we can use a static gen-key pair method to
// create a key-pair object within the construct of this wallet.

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE
    this.keyPair = ChainUtil.genKeyPair()
    this.publicKey = this.keyPair.getPublic().encode("hex") // hexidecimal string form
  }

  toString() {
    return `Wallet -
    PublicKey  :  ${this.publicKey.toString().substring(0, 10)} ...
    Balance    :  ${this.balance}`
  }

  // We still have to create the vital input object which provides information about the sender.
  // This information includes: senders original balance his or her public key and most importantly his or her signature for the transaction.
  // To generate signatures the "elliptic" module gives us a convenient method called "sign" within the key-pair object.
  // This allows us to take any data in its hash form return a signature based on the key-pair private key and the data.

  // Later on, the generated signature and the matching public key to be used to verify the authenticity of the signature.

  sign(dataHash) {
    return this.keyPair.sign(dataHash)
  }

  // A transaction pool we'll collect all transactions submitted by individuals in the cryptocurrency network.
  // Then miners will do the work of taking transactions from the pool and including them in the blotching.

  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain)

    if (amount > this.balance) {
      return console.log(`Amount ${amount} exceeds balance: ${this.balance}`)
    }

    let transaction = transactionPool.existingTransaction(this.publicKey)

    if (transaction) {
      transaction.update(this, recipient, amount)
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount)
      transactionPool.updateOrAddTransaction(transaction)
    }

    return transaction
  }

  // the only authority who can send money to miners is the blockchain itself

  static blockchainWallet() {
    const blockchainWallet = new this()
    blockchainWallet.address = "blockchain-wallet"
    return blockchainWallet
  }

  // Now that minors are adding blocks to the block chain that consist of transactions
  // we can add a function to the wallet class that calculate its balance based on a given blockchain.
  // This will be the most complex and involved single function that we write.
  // overall Keep in mind that the idea is to calculate the balance for this wallet based on only the most recent
  // outputs dedicated to it since its most recent transactions on the blockchain

  calculateBalance(blockchain) {
    let balance = this.balance
    const transactions = []

    blockchain.chain.forEach(block => {
      block.data.forEach(transaction => {
        transactions.push(transaction)
      })
    })

    // array of wallet input transactions that match wallet.publicKey
    const walletInputTs = transactions.filter(
      transaction => transaction.input.address === this.publicKey
    )

    // find most recent input transaction

    let startTime = 0

    if (walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce((prev, current) => {
        prev.input.timestamp > current.input.timestamp ? prev : current
      })

      balance = recentInputT.outputs.find(
        output => output.address === this.publicKey
      ).amount

      startTime = recentInputT.input.timestamp
    }

    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime)
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) balance += output.amount
        })
    })

    return balance
  }
}

module.exports = Wallet
