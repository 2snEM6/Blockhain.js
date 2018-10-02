class Miner {
  constructor(name, blockchain, wallet) {
    this.name = name;
    this.wallet = wallet;
    this.blockchain = blockchain;
  }

  mineBlock() {
    const latestBlock = this.blockchain.getMaximumHeightBlock();
    let candidateBlock = latestBlock.createChild(this.wallet.getAddress(), this.blockchain.difficulty);
    const pendingTransactions = this.blockchain.getPendingTransactions();

    for (const pendingTransaction in pendingTransactions) {
      candidateBlock.addTransactionIfValid(pendingTransactions[pendingTransaction]);
    }

    const { mined, error } = this.blockchain.mineBlock(candidateBlock, this.wallet.getAddress());
    if (mined) console.log(`Block #${candidateBlock._header.height} has been mined`);
    else {
      console.log(`Error mining block #${candidateBlock._header.height} REASON: ${error}`)
    }

  }
}

module.exports = {
  Miner
};