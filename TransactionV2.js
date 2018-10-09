const { verifySignature, sign } = require('./crypto');
const SHA256 = require('crypto-js/sha256');

class Transaction {
  /**
   * 
   * @param {number} version 
   * @param {number} vin 
   * @param {number} vout 
   * @param {array.<TXInput>} inputs 
   * @param {array.<UTXO>} outputs 
   * @param {number} locktime 
   */
  constructor(version = 1, vin = 0, vout = 0, inputs = [], outputs = [], locktime = 0) {
    this.version = 1;
    this.vin = vin;
    this.vout = vout;
    this.inputs = inputs;
    this.outputs = outputs;
    this.locktime = locktime;
    this.hash = this.calculateHash();
  }

  hasValidSignature() {
    return (
      this.signature !== undefined && verifySignature(this.hash, this.signature, this.inputPublicKey)
    )
  }

  sign(privateKey) {
    this.signature = sign(this.hash, privateKey);
  }

  calculateHash() {
    return SHA256(this.inputPublicKey + this.outputPublicKey + this.amount + this.fee).toString();
  }
}

module.exports = {
  Transaction
};