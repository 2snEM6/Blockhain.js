const SHA256 = require('crypto-js/sha256');
const { Tools } = require('./Tools');
const { UTXOPool } = require('./UTXOPool');
const { clone, values } = require('ramda');

class Block {
  constructor(height, blockchain, previousBlockHash = '', utxoPool = new UTXOPool(), feeBeneficiaryAddress = '0xLIMIA') {

    this.blockchain = blockchain;
    this.feeBeneficiaryAddress = feeBeneficiaryAddress;
    this.utxoPool = utxoPool;
    this.transactions = {};
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

  createChild(feeBeneficiaryAddress) {
    const block = new Block(this._header.height + 1, this.blockchain,
      this._header.previousBlockHash = this.hash, clone(this.utxoPool), feeBeneficiaryAddress);
    // For convenience, allow the miner to immediately spend the coinbase coins
    block.utxoPool.addUTXO(feeBeneficiaryAddress, 12.5); // TODO This needs to be added as a transaction
    return block;
  }

  addTransaction(transaction) {
    if (!this.isValidTransaction(transaction)) return;
    this.transactions[transaction.hash] = transaction;
    this.utxoPool.handleTransaction(transaction, this.feeBeneficiaryAddress);
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
    if (values(this.transactions).length === 0) return '';
    const transactionHashes = values(this.transactions).map((transaction) => transaction.hash);
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