const Websocket = require("ws")

// This concept will also check if a peer environment variable has been declared
// HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev

const P2P_PORT = process.env.P2P_PORT || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(",") : []

class P2pServer {
  constructor(blockchain) {
    this.blockchain = blockchain // leisure containing data
    this.sockets = [] // list of all ws sockets connected
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT })
    server.on("connection", socket => this.connectSocket(socket))

    this.connectToPeers()

    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`)
  }

  connectToPeers() {
    peers.forEach(peer => {
      // a peer will look like this: "ws://localhost:5002"
      const socket = new Websocket(peer)
      socket.on("open", () => this.connectSocket(socket))
    })
  }

  connectSocket(socket) {
    this.sockets.push(socket)
    console.log("Socket connected")
    console.log(`Total sockets connected: ${this.sockets.length}`)

    this.messageHandler(socket)
    this.sendChain(socket)
  }

  messageHandler(socket) {
    socket.on("message", message => {
      // data is the chain from another peer
      const data = JSON.parse(message)
      this.blockchain.replaceChain(data)
    })
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain))
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket))
  }
}

module.exports = P2pServer

// HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
// HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
// HTTP_PORT=3004 P2P_PORT=5004 PEERS=ws://localhost:5001,ws://localhost:5002,ws://localhost:5003 npm run dev
// HTTP_PORT=3005 P2P_PORT=5005 PEERS=ws://localhost:5001,ws://localhost:5002,ws://localhost:5003,ws://localhost:5004 npm run dev
