const SHA256 = require("crypto-js/sha256")

// Secure Hash Algorith SHA - 256bits => 32 bytes => 32 characters
// Even if one character changes in original data, algorithm produce new unique string of character
// BUT same output for same inital data, since we use a changing timestamp, this will never happen
// Pretty much impossible to dectypt the hash (One-Way)
// this function links hashes together, making possible blockchain

class Block {
  constructor(timestamp, lastHash, hash, data) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
  }

  // toString() usally used in debugging
  // substring() will only take a part of the string, hashes are REALLY long
  toString() {
    return `Block - 
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Data      : ${this.data}`
  }

  // using it directly "Block.genesis()"
  // first block, harcoded to start blockchain
  static genesis() {
    return new this("Genesis Time", "----", "f1r57-h45h", [])
  }

  // represents uniqye data we want to get the hash for
  static hash(timestamp, lastHash, data) {
    return SHA256(`${timestamp}${lastHash}${data}`).toString()
  }

  // using it directly "Block.mineBlock()"
  static mineBlock(lastBlock, data) {
    const timestamp = Date.now() // UNIX time
    const lastHash = lastBlock.hash
    const hash = Block.hash(timestamp, lastHash, data)

    return new this(timestamp, lastHash, hash, data)
  }
}

module.exports = Block
