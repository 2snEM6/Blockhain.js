const { values, maxBy, path, reduce } = require('ramda');
const Block = require('./Block');


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

    const parent = this.chain[block.previousBlockHash];
    if (parent === undefined && parant.height + 1 !== block.height) return;

    const isParentMaxHeight = this.getMaximumHeightBlock().hash === parent.hash;





  }

  getMaximumHeightBlock() {
    const maxByHeightFunction = maxBy(path(["header", "height"]));
    return reduce(maxByHeightFunction, this.chain[0], this.chain);
  }

  minePendingTransactions(minerRewardAddress) {
    const block = new Block(this, this.pendingTransactions, this.getLatestBlock().hash);
    const mined = block.mineBlock(this.difficulty);

    if (mined) {
      console.log('Block #' + this.chain.length + ' successfully mined');
      this.chain.push(block);
      this.pendingTransactions = [
        new Transaction(null, minerRewardAddress, this.miningReward)
      ];

      return true;
    }
    console.log('Failure mining block #' + this.chain.length);
    return false;
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
