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

    // create a block consisted of the valid transactions

    // syncronize the chains in the peer2peer server

    // clear the transaction pool

    // broadcast to every miner to clear their transaction pools
  }
}

module.exports = Miner
