const { INITIAL_BALANCE } = require("../config")

const ChainUtil = require("../chain-util")

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
}

module.exports = Wallet
