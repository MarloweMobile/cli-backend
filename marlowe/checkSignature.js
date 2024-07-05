const {Wallet} = require('../models/wallet');

async function checkSignature(reqSignature, signature) {
  
  console.log(signature)
  console.log(reqSignature.walletSeed)

  if (signature === reqSignature.walletSeed) {
    return true;
  } else {
    return false;
  }
}
module.exports = checkSignature