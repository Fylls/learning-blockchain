const EC = require("elliptic").ec

// Fast elliptic-curve cryptography in a plain javascript implementation.

const ec = new EC("secp256k1")

// Standards for Efficient Cryptography (SEC)
// 256bit prime, k1 Koblitz curve no. 1 (Mathematician)
// Bitcoin uses this algorithm

const uuidv1 = require("uuid").v1

// Universal Unique Identifier (UUID)
// There are multiple versions of the ID generating function of UUID module but Version1 fits our
// use case since its time stamped based.

const SHA256 = require("crypto-js/sha256")

// Secure Hash Algorith SHA - 256bits => 32 bytes => 32 characters
// Even if one character changes in original data, algorithm produce new unique string of character
// BUT same output for same inital data, since we use a changing timestamp, this will never happen
// Pretty much impossible to dectypt the hash (One-Way)
// this function links hashes together, making possible blockchain

//

/*================================================================================================*/
/*================================================================================================*/

//

class ChainUtil {
  //  <-- NO Constructor needed -->

  // This instance contains a gen-key pair method that creates a key-pair object.
  // It returns a call to the EC instance that we created in the calling gen-key Pair.
  // The generated key per object itself is also powerful with this key-pair object,
  // We can use methods that get the public and private key created in this key pair.
  // It also has assigned method which can be used to generate a signature based on given data.

  static genKeyPair() {
    return ec.genKeyPair()
  }

  // This UUID module gives us a function which can generate a random string of 32 characters.
  // That is partly based on the current time (UNIX Timestamp) in order to create unique IDs for objects.

  static id() {
    return uuidv1()
  }

  // This function will create a hash no matter the type of the data coming in

  static hash(data) {
    return SHA256(JSON.stringify(data)).toString()
  }

  // Eventually we'll provide a system where multiple users are submitting transactions to a collection and then
  // Miners on the network will take a chunk of the transactions in a collection and then include that as data for the Blockchain.
  // However they can't take any arbitrary chunk of transactions, they should only include valid transactions.
  // Therefore to check the validity of transactions primarily they need to verify the signatures on each transaction input

  // "elliptic" our cryptography and private and public-key module provides a key object for us that has a verify method.
  // This verify method returns a true or false value to represent the validity of an incoming signature.
  // So to use this "verify" method Well we'll need a key object itself.
  // And luckily we can get this key object by using a key from public function within the EC instance
  // that is created at the top of the file.

  static verifySignature(publicKey, signature, dataHash) {
    return ec.keyFromPublic(publicKey, "hex").verify(dataHash, signature)
  }
}

module.exports = ChainUtil
