const { Blockchain } = require('./Blockchain');
const { Block } = require('./Block');
const { Transaction } = require('./Transaction');
const { generatePair, sign } = require('./crypto');

const mainNet = new Blockchain('Main net');

const {publicKey, privateKey} = generatePair();

const transaction = new Transaction('OxLIMIA', '0xSILVIA', 300, 10, );





