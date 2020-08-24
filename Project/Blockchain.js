const Block = require("./Block")

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()]
  }

  // Introduces mining to add block

  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1]
    const block = Block.mineBlock(lastBlock, data)
    this.chain.push(block)

    return block
  }

  // this function checks whether there are error in the chain
  // Check genesis and every block one by one

  isValidChain(chain) {
    // using "stringify" since 2 object with different place in memory cannot be equal
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }

    // validation of every block after genesis
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const lastBlock = chain[i - 1]
      if (
        block.lastHash !== lastBlock.hash || // hashes pointing to the right place
        block.hash !== Block.blockHash(block) // hashes are not artificial and can be verified against algorithm
      ) {
        return false
      }

      return true
    }
  }

  // Why replacing longer chains? if chains are the same length they likely contains the same data
  // Choosing a longer chain resolves the problem of multiple chains uploaded at once
  // If longer chain, it is convenient to everyone to agree on the chain with the higher number of blocks

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log("recieved chain is shorter or equal to the current chain")
      return
    } else if (!this.isValidChain(newChain)) {
      console.log("the received chain is not valid")
      return
    }

    console.log("replacing blockchain with the new chain")
    this.chain = newChain // valid and longer
  }
}

module.exports = Blockchain
