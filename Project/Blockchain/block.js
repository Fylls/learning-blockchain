const ChainUtil = require("../chain-util")

const { DIFFICULTY, MINE_RATE } = require("../config")

// The Nonce is a value that is included as part of the calculation of the hash for the block.
// By changing this Nonce value, miners can continue to generate new hashes with a number of leading zeros
// The match the current difficulty of the blockchain system.

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
    this.nonce = nonce
    this.difficulty = difficulty || DIFFICULTY // if not specified, use default
  }

  // toString() usally used in debugging
  // substring() will only take a part of the string, hashes are REALLY long

  toString() {
    return `Block - 
      Timestamp   :   ${this.timestamp}
      Last Hash   :   ${this.lastHash.substring(0, 10)} ...
      Hash        :   ${this.hash.substring(0, 10)} ...
      Nonce       :   ${this.nonce}
      Difficulty  :   ${this.difficulty}
      Data        :   ${this.data}`
  }

  // Using it directly "Block.genesis()"
  // First block, harcoded to start blockchain

  static genesis() {
    return new this("Genesis Time", "---", "f1r57-h45h", [], 0, DIFFICULTY)
  }

  // represents unique data we want to get the hash for

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(
      `${timestamp}${lastHash}${data}${nonce}${difficulty}`
    ).toString()
  }

  // Checking block hash
  // hashes should not be artificial and are verifiable against algorithm

  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block
    return Block.hash(timestamp, lastHash, data, nonce, difficulty)
  }

  // Dynamically setting the difficulty to push a new block every "MINE_RATE" time
  // As the network grows, geows its compuuting potetial as well, so it is important to control
  // how many block are pushed in a fdesidered interval

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock

    difficulty =
      currentTime - lastBlock.timestamp > MINE_RATE
        ? difficulty - 1 // mined to slowly
        : difficulty + 1 // mined to quickly

    return difficulty
  }

  // What Miners do to Validate the new block in the chain

  static mineBlock(lastBlock, data) {
    let hash, timestamp
    let difficulty = lastBlock.difficulty
    let lastHash = lastBlock.hash

    // nonce value is going to be used in the generation of the hash until a hash is found,
    // with a number of leading zeroes that match the current difficulty of the blockchain system.

    let nonce = 0

    do {
      nonce++
      timestamp = Date.now()
      difficulty = Block.adjustDifficulty(lastBlock, timestamp)
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty)
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty))

    return new this(timestamp, lastHash, hash, data, nonce, difficulty)
  }
}

module.exports = Block
