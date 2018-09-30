class UTXO {
  constructor(publicKey, amount) {
    this.publicKey = publicKey;
    this.amount = amount;
  }
}

module.exports = {
  UTXO
};