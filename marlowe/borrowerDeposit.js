const {Wallet} = require('../models/wallet');
const {Contract} = require('../models/contract');
const updateContract = require('./updateContract')
const cp = require('child_process');

const exec_options = { 
	encoding: 'utf8', 
	cwd: '/home/preview/keys', 
	env: null,
	timeout: 0,
	maxBuffer: 200 * 1024,
	killSignal: 'SIGTERM'
};

async function borrowerDeposit(contract) {

  const borrowerWallet = await Wallet.findById(contract.roles[1].wallet).populate();
  const magic = 2
  const utxo = contract.stateTx//queryUtxo(contract.contractFiles.contractAddress)
  const marlowe2 = contract.transactions[0].marlowe[1]
  const marlowe3 = contract.transactions[0].marlowe[2]
  const borrowerAddr = borrowerWallet.walletAddress
  const borrowerKey = borrowerWallet.walletSeed
  const tx3Signed = contract.transactions[1].tx[2]
  const id = contract.id

  const borrowerSigns = 'marlowe-cli run auto-execute \
  --testnet-magic ' + magic + ' \
  --tx-in-marlowe ' + utxo + ' \
  --marlowe-in-file ' + marlowe2 + ' \
  --marlowe-out-file ' + marlowe3 + ' \
  --change-address ' + borrowerAddr + ' \
  --required-signer ' + borrowerKey + ' \
  --out-file ' + tx3Signed + ' \
  --submit=600s'

  cp.exec(`${borrowerSigns}`, exec_options, (err, stdout, stderr) => {
    console.log(stdout)
    console.log(stderr)
    console.log(err)

    const txOut = stdout.toString('utf8')
    console.log(txOut)

    const marloweOut = txOut.substring(6, 70) + '#1'
    console.log(marloweOut)

    updateContract(id, marloweOut)
  })

  console.log('marlowe-cli run auto-execute \
    --tx-in-marlowe ' + utxo + ' \
    --marlowe-in-file ' + marlowe2 + ' \
    --marlowe-out-file ' + marlowe3 + ' \
    --change-address ' + borrowerAddr + ' \
    --required-signer ' + borrowerKey + ' \
    --out-file ' + tx3Signed + ' \
    --submit 600')
}

module.exports = borrowerDeposit