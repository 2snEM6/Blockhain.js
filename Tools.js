const SHA256 = require('crypto-js/sha256');
const MerkleTree = require('merkletreejs');

class Tools {
  static createTimestamp() {
    return (new Date()).getTime();
  }

  static SHA256WithBuffer(data) {
    const dataAsString = Tools.bufferToString(data);
    const hashedString = SHA256(dataAsString).toString();
    return Tools.stringToBuffer(hashedString);
  };

  static bufferToString(data) {
    return data.toString('utf8');
  };


  static stringToBuffer(data) {
    return Buffer.from(data, 'utf8');
  };


  static computeMerkleRootHash(arrayOfHashes) {
    const leavesAsBuffer = arrayOfHashes.map(Tools.stringToBuffer);
    const tree = new MerkleTree(leavesAsBuffer, Tools.SHA256WithBuffer, {
      isBitcoinTree: true
    });

    return tree.getRoot().toString('utf8');
  }
}

module.exports = {
  Tools
};