const Block = require("./Blockchain/block")
const Blockchain = require("./Blockchain")

const bc = new Blockchain()

// adding 10 blocs to the chain

for (let i = 0; i < 10; i++) {
  console.log(bc.addBlock(`foo ${i}`).toString())
}
