// An API is a collection of HTTP requests that will allow users to interact with our running application.

// Through this API users will be able to view the blocks currently held in one of our blockchain instances and then they
// will be able to act as miners through a mining end point which will create in order to add new blocks of the chain.

// So as we add more features to our blood chain will continue to grow this API.

const express = require("express")
const Blockchain = require("../Blockchain")

const bc = new Blockchain()

//  Init + Middlewares
const app = express()
app.use(express.json())

// Home Route
app.get("/", (req, res) => res.send("server is working"))

// Block Routes
// getting all the blocks in the blackchain
app.get("/blocks", (req, res) => res.json(bc.chain))

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data)
  console.log(`New block was added: ${block.toString()}`)
  res.redirect("/blocks")
})

const PORT = process.env.HTTP_PORT || 3001
app.listen(PORT, () => console.log(`listening on port:${PORT}`))
