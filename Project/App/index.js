// An API is a collection of HTTP requests that will allow users to interact with our running application.

// Through this API users will be able to view the blocks currently held in one of our blockchain instances and then they
// will be able to act as miners through a mining end point which will create in order to add new blocks of the chain.

// So as we add more features to our blood chain will continue to grow this API.

// Dependencies
const express = require("express")
const TransactionPool = require("../Wallet/transaction-pool")
const Blockchain = require("../Blockchain")
const P2pServer = require("./p2p-server")
const Wallet = require("../Wallet")

// Config
const HTTP_PORT = process.env.HTTP_PORT || 3001

// Globals
const app = express()
const w = new Wallet()
const bc = new Blockchain()
const tp = new TransactionPool()
const p2pServer = new P2pServer(bc, tp)

// Middlewares
app.use(express.json())

// Home Route
app.get("/", (req, res) => res.send("server is working"))

// Block Routes
// getting all the blocks in the blackchain
app.get("/blocks", (req, res) => res.json(bc.chain))

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data)
  console.log(`New block was added: ${block.toString()}`)

  p2pServer.syncChains()

  res.redirect("/blocks")
})

// Transactions
app.get("/transactions", (req, res) => {
  res.json(tp.transactions)
})

app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body

  const transaction = w.createTransaction(recipient, amount, tp)
  p2pServer.broadTransaction(transaction)

  res.redirect("/transactions")
})

// Exposing PublicKey of client
app.get("/public-key", (req, res) => res.json({ publicKey: w.publicKey }))

// Starting Express Server
app.listen(HTTP_PORT, () =>
  console.log(`Listening for connections to API on port: ${HTTP_PORT}\n`)
)

// Starting WebSocket Server
p2pServer.listen()
