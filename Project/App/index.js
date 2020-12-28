// An API is a collection of HTTP requests that will allow users to interact with our running application.

// Through this API users will be able to view the blocks currently held in one of our blockchain instances and then they
// will be able to act as miners through a mining end point which will create in order to add new blocks of the chain.

// So as we add more features to our blood chain will continue to grow this API.

// Dependencies
const express = require("express")

// Classes
const TransactionPool = require("../Wallet/transaction-pool")
const Blockchain = require("../Blockchain")
const P2pServer = require("./p2p-server")
const Wallet = require("../Wallet")
const Miner = require("./miner")

// Config
const HTTP_PORT = process.env.HTTP_PORT || 3001

// Globals
const app = express()
const w = new Wallet()
const bc = new Blockchain()
const tp = new TransactionPool()
const p2pServer = new P2pServer(bc, tp)
const miner = new Miner(w, p2pServer, bc, tp)

// Middlewares
app.use(express.json())

// Home Route
app.get("/", (req, res) => res.send("server is working"))

// Exposing PublicKey of client
app.get("/public-key", (req, res) => res.json({ publicKey: w.publicKey }))

// Getting all the blocks in the blackchain
app.get("/blocks", (req, res) => res.json(bc.chain))

// View all transactions in transaction-pool
app.get("/transactions", (req, res) => res.json(tp.transactions))

// Adding a new unconfirmed Transaction
app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body
  const transaction = w.createTransaction(recipient, amount, bc, tp)
  p2pServer.broadcastClearTransactions(transaction)
  res.redirect("/transactions")
})

// Create a block and sync all blockchains once mined correctly
app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data)
  console.log(`New block was added: ${block.toString()}`)
  p2pServer.syncChains()
  res.redirect("/blocks")
})

app.get("/mine-transactions", (req, res) => {
  const block = miner.mine()
  console.log(`New block was added: ${block.toString()}`)
  res.redirect("/blocks")
})

// Starting Express Server
app.listen(HTTP_PORT, () =>
  console.log(`Listening for connections to API on port: ${HTTP_PORT}\n`)
)

// Starting WebSocket Server
p2pServer.listen()
