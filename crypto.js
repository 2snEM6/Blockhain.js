const elliptic =  require('elliptic');
const ec = new elliptic.ec("secp256k1");

function generatePair() {
  const keypair = ec.genKeyPair();
  window.keypair = keypair;
  return {
    publicKey: keypair.getPublic("hex"),
    privateKey: keypair.getPrivate("hex")
  };
}

function sign(message, privateKey) {
  try {
    const keypair = ec.keyFromPrivate(privateKey, "hex");
    return keypair.sign(message).toDER("hex");
  } catch (error) {
    return "invalid signature";
  }
}

function verifySignature(message, signature, publicKey) {
  try {
    const keypair = ec.keyFromPublic(publicKey, "hex");
    return ec.verify(message, signature, keypair);
  } catch (error) {
    return false;
  }
}

module.exports = {
  generatePair,
  sign,
  verifySignature
};