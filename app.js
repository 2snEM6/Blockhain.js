








const mainNet = new Blockchain('MainNet');
mainNet.createTransaction(new Transaction('ADDRESS1', 'ADDRESS2', 100));
mainNet.createTransaction(new Transaction('ADDRESS2', 'ADDRESS1', 50));

console.log('Starting the miner');
mainNet.minePendingTransactions('miners-address');

console.log('Balance of the miner is', mainNet.getBalanceOfAddress('miners-address'));

console.log('Starting the miner');
mainNet.minePendingTransactions('miners-address');

console.log('Balance of the miner is', mainNet.getBalanceOfAddress('miners-address'));

console.log('Blockchain valid: ', mainNet.isChainValid());

