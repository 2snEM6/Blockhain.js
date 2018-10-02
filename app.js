const { Blockchain } = require('./Blockchain');
const { Wallet } = require('./Wallet');
const { Miner } = require('./Miner');

// We create the main blockchain network
const mainNet = new Blockchain('Main net');

// Three wallets, one for Alice, one for Bob and one for Toni, the miner.
const alicesWallet = new Wallet(mainNet, 'Alice'); alicesWallet._addFunds(150); //This doesn't happen in real life. It's just as done for the base case.
const bobsWallet = new Wallet(mainNet, 'Bob');
const tonisWallet = new Wallet(mainNet, 'Toni');

console.log("Silvia's balance: " + bobsWallet.getBalance());
console.log("Dani's balance: " + alicesWallet.getBalance());

// Dani wants to send 100 coins to Silvia
alicesWallet.transferTo(bobsWallet.getAddress(), 100);
console.log("Alice transfers 100 coins to Bob");

// A miner mines a block;
const miner = new Miner(tonisWallet.name, mainNet, tonisWallet);
miner.mineBlock();


console.log("Bob's balance: " + bobsWallet.getBalance());
console.log("Alice's balance: " + alicesWallet.getBalance());

console.log('FINISHED');