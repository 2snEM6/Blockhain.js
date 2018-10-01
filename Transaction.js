const { verifySignature } = require('./crypto');
const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(inputPublicKey, outputPublicKey, amount, fee, signature = '') {
    this.inputPublicKey = inputPublicKey;
    this.outputPublicKey = outputPublicKey;
    this.amount = amount;
    this.fee = fee;
    this.signature = signature;
    this.hash = this.calculateHash();
  }

  hasValidSignature() {
    return (
      this.signature !== undefined && verifySignature(this.hash, this.signature, this.inputPublicKey)
    )
  }

  calculateHash() {
    return SHA256(this.inputPublicKey + this.outputPublicKey + this.amount + this.fee).toString();
  }
}

module.exports = {
  Transaction
};