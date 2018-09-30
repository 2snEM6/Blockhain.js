class UTXOPool {
  constructor(utxos = {}) {
    this.utxos = utxos;
  }

  addUTXO(publicKey, amount) {
    if (this.utxos[publicKey]) {
      this.utxos[publicKey].amount += amount;
    } else {
      const utxo = new UTXO(publicKey, amount);
      this.utxos[publicKey] = utxo;
    }
  }
}