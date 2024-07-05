const cp = require('child_process')
const fs = require('fs')
const {Wallet} = require('../models/wallet');

const exec_options = { 
	encoding: 'utf8', 
	cwd: '/home/preview/keys', 
	env: null,
	timeout: 0,
	maxBuffer: 200 * 1024,
	killSignal: 'SIGTERM'
};

// create contract files from Schema
async function designContract(contract) {

	//console.log(contract.roles[0].walletId.toString())

	const socket = './node.socket'
	const magic = 2
	const ada = 1000000
	const minAda = 2000000

	const lenderWallet = await Wallet.findById(contract.roles[0].wallet).populate();
	const borrowerWallet = await Wallet.findById(contract.roles[1].wallet).populate();
	const lenderAddr = lenderWallet.walletAddress
	const borrowerAddr = borrowerWallet.walletAddress
	const principal = (contract.roles[0].value)*ada
	const interest = (contract.roles[1].value)*ada
	const lenderDeadline = contract.roles[0].deadline
	const borrowerDeadline = contract.roles[1].deadline
	const zcbContract = contract.contractFiles.contractFile
	const zcbState = contract.contractFiles.contractState

	const zcb = 'marlowe-cli template zcb \
	--minimum-ada ' + minAda + ' \
	--lender ' + lenderAddr + ' \
	--borrower ' + borrowerAddr + ' \
	--principal ' + principal + ' \
	--interest ' + interest + ' \
	--lending-deadline ' + lenderDeadline + ' \
	--repayment-deadline ' + borrowerDeadline + ' \
	--out-contract-file ' + zcbContract + ' \
	--out-state-file ' + zcbState

	cp.exec(`${zcb}`, exec_options, (err, stdout, stderr) => {
		console.log(stdout)
		console.log(err)
		console.log(stderr)
	})

	console.log('marlowe-cli template zcb \
		--minimum-ada ' + minAda + ' \
		--lender ' + lenderAddr + ' \
		--borrower ' + borrowerAddr + ' \
		--principal ' + principal + ' \
		--interest ' + interest + ' \
		--lending-deadline ' + lenderDeadline + ' \
		--repayment-deadline ' + borrowerDeadline + ' \
		--out-contract-file ' + zcbContract + ' \
		--out-state-file ' + zcbState)

		//return cp.execSync('marlowe-cli template zcb \
}

module.exports = designContract