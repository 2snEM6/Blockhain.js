const { values, maxBy, path, reduce } = require('ramda');
const { Block } = require('./Block');


class Blockchain {
  constructor(name) {
    this.name = name;
    this.genesisBlock = null;
    this.difficulty = 3;
    this.chain = {};
    this.pendingTransactions = [];
    this.miningReward = 100;

    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const block = new Block(1, this, "root");
    this.chain[block.hash] = block;
    this.genesisBlock = block;
    console.log('GENESIS BLOCK CREATED');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  containsBlock(block) {
    return this.chain[block.hash] !== undefined;
  }

  addBlock(block) {
    if (!block.isValid()) return;
    if (this.containsBlock(block)) return;

    // check that the parent is actually existent and the advertised height is correct
    const parent = this.chain[block.header.previousBlockHash];
    if (parent === undefined && parent.height + 1 !== block.height) return;

    const isParentMaxHeight = this.getMaximumHeightBlock().hash === parent.hash;

    // clone the utxo pool of the parent and reconcile with the block
    const newUtxoPool = parent.utxoPool.clone();
    block.utxoPool = newUtxoPool;

    // Add fee amount to the pool
    block.utxoPool.addUTXO(block.feeBeneficiaryAddress, 12.5);

    // Reapply transactions to validate them
    const transactions = block.transactions;
    block.transactions = {};
    let containsInvalidTransactions = false;

    Object.values(transactions).forEach(transaction => {
      if (block.isValidTransaction(transaction)) {
        block.addTransaction(transaction);

        // if we have the transaction as a pending one on the chain, remove it from the pending pool if we are at max height
        if (isParentMaxHeight && this.pendingTransactions[transaction.hash])
          delete this.pendingTransactions[transaction.hash];
      } else {
        containsInvalidTransactions = true;
      }
    });

    // If we found any invalid transactions, dont add the block
    if (containsInvalidTransactions) return;
    this.chain[block.hash] = block;
  }


  getMaximumHeightBlock() {
    const maxByHeightFunction = maxBy(path(["header", "height"]));
    return reduce(maxByHeightFunction, this.chain[0], this.chain);
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transation of block.transactions) {
        if (transation.fromAddress === address) {
          balance -= transation.amount;
        }

        if (transation.toAddress === address) {
          balance += transation.amount;
        }
      }
    }

    return balance;
  }


  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log('Chain invalid at block #' + i + ' Reason: hash mismatch');
        throw Error('Chain invalid at block #' + i + ' Reason: hash mismatch');
      }

      if (currentBlock.header.previousBlockHash !== previousBlock.hash) {
        console.log('Chain invalid at block #' + i + ' Reason: previous hash mismatch');
        throw Error('Chain invalid at block #' + i + ' Reason: previous hash mismatch');      }
    }

    return true;
  }
}

module.exports = {
  Blockchain
};
