const Block = require("./Block")
const Blockchain = require("./Blockchain")

// Testing the .toString() implementation
const block = new Block("foo", "bar", "zoo", "baz")
console.log("============== Example ==============\n")
console.log(block.toString())

// Testing the creation of the Genesis Block
console.log("\n============== Genesis ==============\n")
console.log(Block.genesis().toString())

// Testing the creation of a new block
const fooBlock = Block.mineBlock(Block.genesis(), "foo")
console.log("\n============== New Foo ==============\n")
console.log(fooBlock.toString())
