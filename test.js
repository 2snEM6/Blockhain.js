const { Blockchain } = require('./Blockchain');
const { Block } = require('./Block');

const mainNet = new Blockchain('Main net');

console.log(mainNet.isChainValid());


mainNet.addBlock(new Block());


console.log(JSON.stringify(mainNet, null, 2));