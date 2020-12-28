const Transaction = require("../Wallet/transaction")
const TransactionPool = require("../Wallet/transaction-pool")
const Wallet = require("../Wallet")

class Miner {
  constructor(wallet, p2pServer, blockchain, transactionPool) {
    this.wallet = wallet
    this.p2pServer = p2pServer
    this.blockchain = blockchain
    this.transactionPool = transactionPool
  }

  // This method will be pretty powerful in a sense that it ties together all the
  // engineering functionality we had built up to this point.

  // First it grabs transactions from the pool,
  // then it will take those transactions and create a block whose data consists of those transactions.
  // then it tells a peer-to-peer server to synchronize the chains and include the new block with those transactions.
  // Finally it should tell the transaction pool to clear itself of all of its transactions since they're now officially included in the blotching

  mine() {
    const validTransactions = this.transactionPool.validTransactions()

    // include a reward for the miner
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    )

    // create a block consisted of the valid transactions
    const block = this.blockchain.addBlock(validTransactions)

    // syncronize the chains in the peer2peer server
    this.p2pServer.syncChains()

    // clear the transaction pool
    this.transactionPool.clear()

    // broadcast to every miner to clear their transaction pools
    this.p2pServer.broadcastClearTransactions()

    return block
  }
}

module.exports = Miner
