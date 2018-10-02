const { values, maxBy, path, reduce, pathOr, prop } = require('ramda');
const { Block } = require('./Block');


class Blockchain {
  constructor(name) {
    this.name = name;
    this.genesisBlock = null;
    this.difficulty = 3;
    this.chain = {};
    this.pendingTransactions = {};
    this.miningReward = 100;

    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const block = new Block(1, this, "root");
    this.chain[block.hash] = block;
    this.genesisBlock = block;
    console.log('GENESIS BLOCK CREATED');
  }

  containsBlock(block) {
    return this.chain[block.hash] !== undefined;
  }

  getUnspentTransactionOutputsFromAddress(address) {
    const utxoPool = this.getMaximumHeightBlock().utxoPool;
    const getUTXOS = (address) => path(['utxos', address]);
    return getUTXOS(address)(utxoPool);
  }

  mineBlock(block, feeBeneficiaryAddress) {

    if (this.containsBlock(block)) return {
      mined: false,
      reason: 'Block is already present in the chain.'
    };


    const mined = block.mineBlock(this.difficulty, feeBeneficiaryAddress);
    if (!mined) return {
      mined: false,
      reason: 'Invalid block.'
    };

    const parent = this.chain[block._header.previousBlockHash];
    if (parent === undefined && parent._header.height + 1 !== block.height) return {
      mined: false,
      reaon: 'Incorrect height or parent block mismatch'
    };

    const isParentMaxHeight = this.getMaximumHeightBlock().hash === parent.hash;

    Object.values(block.transactions).forEach(transaction => {
      if (block.isValidTransaction(transaction)) {
        block.utxoPool.handleTransaction(transaction, this.feeBeneficiaryAddress);
        // if we have the transaction as a pending one on the chain, remove it from the pending pool if we are at max height
        if (isParentMaxHeight && this.pendingTransactions[transaction.hash])
          delete this.pendingTransactions[transaction.hash];
      }
    });

    this.chain[block.hash] = block;

    return {
      mined: true
    }
  }




  getMaximumHeightBlock() {
    const blocks = values(this.chain);
    const maxByHeightFunction = maxBy(path(["_header", "height"]));
    return reduce(maxByHeightFunction, blocks[0], blocks);
  }

  addTransactionToThePool(transaction) {
    this.pendingTransactions[transaction.hash] = transaction;
  }

  getBalanceOfAddress(address) {
    const latestBlock = this.getMaximumHeightBlock();
    const getBalance = address => pathOr(0, ['utxoPool','utxos', address, 'amount']);
    return getBalance(address)(latestBlock);
  }

  getPendingTransactions() {
    return this.pendingTransactions;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log('Chain invalid at block #' + i + ' Reason: hash mismatch');
        throw Error('Chain invalid at block #' + i + ' Reason: hash mismatch');
      }

      if (currentBlock._header.previousBlockHash !== previousBlock.hash) {
        console.log('Chain invalid at block #' + i + ' Reason: previous hash mismatch');
        throw Error('Chain invalid at block #' + i + ' Reason: previous hash mismatch');      }
    }

    return true;
  }
}

module.exports = {
  Blockchain
};
