const { UTXO } = require('./UTXO');
const { clone } = require('ramda');

class ChainState {
  /**
   * 
   * @param {object} utxos 
   * @param {string} utxos.publicKey
   * @param {UTXOV2} utxos[publicKey]  
   */
  constructor(utxos = {}) {

    /*
      {
        c + 32ByteTXhash+UTXOindex: [
          {
            height,
            coinbase,
            amount,
            outputType
            script
          }
        ]
      }
    */

    this.utxos = utxos;
  }

}

module.exports = {
  UTXOPool
};