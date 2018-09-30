const MerkleTree = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');
const { path, reduce, maxBy } = require('ramda');


const array = [{ a: {height: 1}}, { a: {height: 2}}];

const filterByMaximumHeight = maxBy(path(['a', 'height']));

const result = reduce(filterByMaximumHeight, array[0], array);


console.log(result);