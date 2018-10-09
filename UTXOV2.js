
/**
 * Unspent Transaction Output V2
 * Stored in the chainstate (LevelDB)
 */
class UTXOV2 {
    /**
     * 
     * @param {number} value The value to be sent to the output
     * @param {string} scriptPubKey Script that specifies the conditions to be met in order to spend this UTXO
     * @param {number} scriptPubKeyLength The size of the locking script
     */
    constructor(value, scriptPubKey, scriptPubKeyLength) {
      this.amount = value;
      this.lockScript = scriptPubKey;
      this.lockScriptSize = scriptPubKeyLength;
    }
  }
  
  module.exports = {
    UTXO
  };