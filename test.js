const { Blockchain } = require('./Blockchain');
const { Block } = require('./Block');
const { Transaction } = require('./Transaction');
const { generatePair, sign } = require('./crypto');

const mainNet = new Blockchain('Main net');

const { publicKey: daniPublicKey, privateKey: daniPrivateKey } = generatePair(); // Dani's wallet

let latestBlock = mainNet.getMaximumHeightBlock();
let newBlock = latestBlock.createChild(daniPublicKey);
newBlock.mineBlock(mainNet.difficulty); //Dani mines a new block and obtains a reward
mainNet.addBlock(newBlock); // Adds block to the cain

const { publicKey: silviaPublicKey, privateKey: silviaPrivateKey } = generatePair();


const transaction = new Transaction(daniPublicKey, silviaPublicKey, 12.5, 0);
const signature = sign(transaction.hash, daniPrivateKey);
transaction.signature = signature;
mainNet.createTransaction(transaction);


latestBlock = mainNet.getMaximumHeightBlock();
newBlock = latestBlock.createChild(daniPublicKey);
newBlock.mineBlock(mainNet.difficulty); //Dani mines a new block and obtains a reward
newBlock.addTransaction(transaction);
mainNet.addBlock(newBlock); // Adds block to the cain

console.log("Silvia's balance: " + mainNet.getBalanceOfAddress(silviaPublicKey));


