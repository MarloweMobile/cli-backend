const cp = require('child_process')
const fs = require('fs')
const {Wallet} = require('../models/wallet');
const { Contract } = require('../models/contract');

const exec_options = { 
	encoding: 'utf8', 
	cwd: '/home/preview/keys', 
	env: null,
	timeout: 0,
	maxBuffer: 200 * 1024,
	killSignal: 'SIGTERM'
};


async function borrowerPrepare(contract) {
  const ada = 1000000
  const minADA = 2000000
  const borrowerWallet = await Wallet.findById(contract.roles[1].wallet).populate();

  const borrowerAddr = borrowerWallet.walletAddress
  const principle = (contract.roles[0].value)*ada
  const interest = (contract.roles[1].value)*ada
  const marlowe2 = contract.transactions[0].marlowe[1]
  const marlowe3 = contract.transactions[0].marlowe[2]

  const borrowerBuilds = 'marlowe-cli run prepare \
  --deposit-account ' + borrowerAddr + ' \
  --deposit-party ' + borrowerAddr + ' \
  --deposit-amount ' + (principle + interest) + ' \
  --invalid-before ' + (Date.now() - 1*60*1000) + ' \
  --invalid-hereafter ' + (Date.now() + (5*60*1000)) + ' \
  --marlowe-file ' + marlowe2 + ' \
  --out-file ' + marlowe3

  

  cp.exec(`${borrowerBuilds}`, exec_options, (err, stdout, stderr) => {
    console.log(stdout)
  })

  console.log('marlowe-cli run prepare \
    --deposit-account ' + borrowerAddr + ' \
    --deposit-party ' + borrowerAddr + ' \
    --deposit-amount ' + (principle + interest) + ' \
    --invalid-before ' + (Date.now() - 1*60*1000) + ' \
    --invalid-hereafter ' + (Date.now() + (5*60*1000)) + ' \
    --marlowe-file ' + marlowe2 + ' \
    --out-file ' + marlowe3)
}

module.exports = borrowerPrepare