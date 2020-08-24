const Blockchain = require("./index")
const Block = require("./block")

describe("Blockchain", () => {
  let bc, bc2

  // using forEach so one test does not pollute the other
  beforeEach(() => {
    bc = new Blockchain()
    bc2 = new Blockchain()
  })

  it("starts with genesis block", () => {
    expect(bc.chain[0]).toEqual(Block.genesis())
  })

  it("adds a new block", () => {
    const data = "data"
    bc.addBlock(data)
    expect(bc.chain[bc.chain.length - 1].data).toEqual(data)
  })

  it("validates a valid chain", () => {
    bc2.addBlock("data")
    expect(bc.isValidChain(bc2.chain)).toBe(true)
  })

  it("invalidates a chain with a corrupted genesis block", () => {
    bc2.chain[0].data = "Bad Data"
    expect(bc.isValidChain(bc2.chain)).toBe(false)
  })

  it("invalidates a corrupted chain", () => {
    bc2.addBlock("data")
    bc2.chain[1].data = "Bad Data"
    expect(bc.isValidChain(bc2.chain)).toBe(false)
  })

  it("replaces a chain with a valid chain", () => {
    bc2.addBlock("data")
    bc2.addBlock("data2")
    bc2.addBlock("data3")
    bc.replaceChain(bc2.chain)
    expect(bc.chain).toEqual(bc2.chain)
  })

  it("does not replace a shorter chain (less or equal)", () => {
    bc.addBlock("data")
    bc.replaceChain(bc2.chain)
    expect(bc.chain).not.toEqual(bc2.chain)
  })

  it("does not replace invalid chain", () => {
    bc2.addBlock("data")
    bc2.chain[0].data = "Bad Data"
    bc.replaceChain(bc2.chain)
    expect(bc.chain).not.toEqual(bc2.chain)
  })
})
