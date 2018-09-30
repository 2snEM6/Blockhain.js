const SHA256 = require('crypto-js/sha256');
const { Tools } = require('./Tools');
const { UTXOPool } = require('./UTXOPool');

class Block {
  constructor(height, blockchain, previousBlockHash = '') {

    this.blockchain = blockchain;
    this.feeBeneficiaryAddress = '0xLIMIA';

    this.transactions = [];
    this.utxoPool = new UTXOPool();
    this._header = {
      version: 1,
      previousBlockHash: previousBlockHash,
      merkleRootHash: '',
      timestamp: Tools.createTimestamp(),
      nonce: 0,
      height: height
    };

    this.hash = this.calculateHash();
  }

  isRoot() {
    return this._header.previousBlockHash === 'root';
  }

  isValid() {
    return this.isRoot() ||this.hash === this.calculateHash();
  }

  addTransaction(transaction) {
    if (!this.isValidTransaction(transaction)) return;
    this.transactions[transaction.hash] = transaction;
    this.utxoPool.handleTransaction(this.transactions, this.feeBeneficiaryAddress);
    this.hash = this.calculateHash();
  }

  isValidTransaction(transaction) {
    return this.utxoPool.isValidTransaction(transaction) && transaction.hasValidSignature();
  }

  addingTransactionErrorMessage(transaction) {
    if (!transaction.hasValidSignature()) return "Signature is not valid";
    return this.utxoPool.addingTransactionErrorMessage(transaction);
  }

  calculateHash() {
    this._header.merkleRootHash = this.calculateHashMerkleRoot();
    return SHA256(JSON.stringify(this._header).toString()).toString();
  }

  calculateHashMerkleRoot() {
    if (this.transactions.length === 0) return '';
    const transactionHashes = this.transactions.map((transaction) => transaction.hash);
    return Tools.computeMerkleRootHash(transactionHashes);
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this._header.nonce++;
      this.hash = this.calculateHash();
    }
    return this.isValid();
  }
}

module.exports = {
  Block
};