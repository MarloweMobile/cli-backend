const cp = require('child_process')
const fs = require('fs')
const {Wallet} = require('../models/wallet');
const updateContract = require('./updateContract')

const exec_options = { 
	encoding: 'utf8', 
	cwd: '/home/preview/keys', 
	env: null,
	timeout: 0,
	maxBuffer: 200 * 1024,
	killSignal: 'SIGTERM'
};

async function lenderPrepare(contract) {
	const ada = 1000000
	const minADA = 2000000

	const lenderWallet = await Wallet.findById(contract.roles[0].wallet).populate();

	const lenderAddr = lenderWallet.walletAddress
	const principal = (contract.roles[0].value)*ada
	const marlowe1 = contract.transactions[0].marlowe[0]
	const marlowe2 = contract.transactions[0].marlowe[1]
	const id = contract.id


	const cli = 'marlowe-cli run prepare \
	--deposit-account ' + lenderAddr + ' \
	--deposit-party ' + lenderAddr + ' \
	--deposit-amount ' + principal + ' \
	--invalid-before ' + (Date.now() - 1*60*1000) + ' \
	--invalid-hereafter ' + (Date.now() + (5*60*1000)) + ' \
	--marlowe-file ' + marlowe1 + ' \
	--out-file ' + marlowe2

  cp.exec(`${cli}`, exec_options, (error, stdout, stderr) => {
    console.log(stdout)
		console.log(stderr)
		console.log(error)

		
  });
	
	console.log('marlowe-cli run prepare \
	--deposit-account ' + lenderAddr + ' \
	--deposit-party ' + lenderAddr + ' \
	--deposit-amount ' + principal + ' \
	--invalid-before ' + (Date.now() - 1*60*1000) + ' \
	--invalid-hereafter ' + (Date.now() + (5*60*1000)) + ' \
	--marlowe-file ' + marlowe1 + ' \
	--out-file ' + marlowe2)
}

module.exports = lenderPrepare