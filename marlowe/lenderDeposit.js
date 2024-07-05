const {Wallet} = require('../models/wallet');
const {Contract} = require('../models/contract');
const queryUtxo = require('./queryUtxo')
const updateContract = require('./updateContract')
const cp = require('child_process')

const exec_options = { 
	encoding: 'utf8', 
	cwd: '/home/preview/keys', 
	env: null,
	timeout: 0,
	maxBuffer: 200 * 1024,
	killSignal: 'SIGTERM'
};

async function lenderDeposit(contract) {
  const lenderWallet = await Wallet.findById(contract.roles[0].wallet).populate();

  const lenderAddr = lenderWallet.walletAddress
  const lenderKey = lenderWallet.walletSeed

  const utxo = contract.stateTx
  const magic = 2

  const marlowe1 = contract.transactions[0].marlowe[0]
  const marlowe2 = contract.transactions[0].marlowe[1]
  const tx2Signed = contract.transactions[1].tx[1]
  const id = contract.id

  const lenderSigns = 'marlowe-cli run auto-execute \
  --testnet-magic ' + magic + ' \
  --tx-in-marlowe ' + utxo + ' \
  --marlowe-in-file ' + marlowe1 + ' \
  --marlowe-out-file ' + marlowe2 + ' \
  --change-address ' + lenderAddr + ' \
  --required-signer ' + lenderKey + ' \
  --out-file ' + tx2Signed + ' \
  --submit=600s'

  const send = cp.exec(`${lenderSigns}`, exec_options, (err, stdout, stderr) => {
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
  --testnet-magic ' + magic + ' \
  --tx-in-marlowe ' + utxo + ' \
  --marlowe-in-file ' + marlowe1 + ' \
  --marlowe-out-file ' + marlowe2 + ' \
  --change-address ' + lenderAddr + ' \
  --required-signer ' + lenderKey + ' \
  --out-file ' + tx2Signed + ' \
  --submit=600s')
}

module.exports = lenderDeposit