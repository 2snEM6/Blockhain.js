const { generatePair } = require('./crypto');
const { Transaction } = require('./Transaction');



class Wallet {
  constructor(blockchain, name) {
    const { publicKey, privateKey } = generatePair();
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.blockchain = blockchain;
    this.name = name;
  }

  getUTXOPool() {
    return this.blockchain.getUnspentTransactionOutputsFromAddress(this.publicKey);
  }

  hasSufficientBalance(amountToPay) {
    return (this.getUTXOPool().amount >= amountToPay);
  }

  getBalance() {
    return this.blockchain.getBalanceOfAddress(this.publicKey);
  }

  _addFunds(amount) {
    console.log(`Adding money to ${this.name} for testing purposes (THIS DOESN'T HAPPEN IN REAL LIFE)`);
    let latestBlock = this.blockchain.getMaximumHeightBlock();
    latestBlock.utxoPool.addUTXO(this.publicKey, amount);
  }

  getAddress() {
    return this.publicKey;
  }

  getPrivateKey() {
    return this.privateKey;
  }

  transferTo(recipientAddress, amount) {
    if (!this.hasSufficientBalance(amount)) {
      console.log(`[Wallet ${this.name}: insufficient funds`);
      return;
    }
    const transaction = new Transaction(this.publicKey, recipientAddress, amount);
    transaction.sign(this.privateKey);
    this.blockchain.addTransactionToThePool(transaction);
  }
}

module.exports = {
  Wallet
};