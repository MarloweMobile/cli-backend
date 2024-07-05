const {Wallet} = require('../models/wallet');

async function updateWalletAddress(wallet, result) {

  const updatedWallet = await Wallet.findByIdAndUpdate(wallet.id, {
    walletAddress: result
    }, 
    {new: true}
    );
  
  return updatedWallet

}

module.exports = updateWalletAddress