const SHA256 = require('crypto-js/sha256');
const Tools = require('./Tools');

class Block {
  constructor(height, blockchain, previousBlockHash = '') {

    this.blockchain = blockchain;

    this.transactions = [];
    this.header = {
      version: 1,
      previousBlockHash: previousBlockHash,
      merkleRootHash: '',
      timestamp: Tools.createTimestamp(),
      nonce: 0,
      height: height
    };

    this.hash = this.calculateHash();
  }

  calculateHash() {
    this.header.merkleRootHash = this.calculateHashMerkleRoot();
    return SHA256(JSON.stringify(this.header).toString()).toString();
  }

  calculateHashMerkleRoot() {
    if (this.transactions.length === 0) return '';
    const transactionHashes = this.transactions.map((transaction) => transaction.hash);
    return Tools.computeMerkleRootHash(transactionHashes);
  }

  addTransaction(transaction) {
    if (!this.isValidTransaction(transaction)) return;
    this.transactions.push(transaction);
    this.hash = this.calculateHash();
  }

  isValidTransaction(transaction) {
    return transaction.hasValidSignature();
  }

  isValid() {
    return this.hash === this.calculateHash();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.header.nonce++;
      this.hash = this.calculateHash();
    }
    return this.isValid();
  }
}

module.exports = {
  Block
};