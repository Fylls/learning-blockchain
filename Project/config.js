const DIFFICULTY = 3

const MINE_RATE = 3000 // 3 seconds in ms, bitcoin usually goes for 10mins

const INITIAL_BALANCE = 500 // how many cryptos

const MINING_REWARD = 50

module.exports = { DIFFICULTY, MINE_RATE, INITIAL_BALANCE, MINING_REWARD }

// Let's create the reward transaction that pays miters for the act of mining.
// A reward transaction would be a transaction object that is similar to a normal transaction object.
// A key difference though will be that the reward transaction needs only one output.
// It only needs to specify the amount of currency that the miner receives as a reward.
// Unlike normal transaction there is no exchange of currency so there is no output necessary to specify a resulting amount for the sender.

// Other than that there is one other key difference:
// The input object will be a unique one that identifies that the actual blockchiain itself conducted the transaction.
// meaning the miners wallet it doesn't sign the transaction, but the blotching itself signs a transaction.
// This means that you'll need to create a special wallet for the blockchain which has the authority to
// sanctions actions as a special entity which signs off reward transaction with no true original sender other than the blockchain itself.
