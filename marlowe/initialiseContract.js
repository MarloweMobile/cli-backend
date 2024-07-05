const {Contract} = require('../models/contract');
const {Wallet} = require('../models/wallet');
const {User} = require('../models/user');
const updateContract = require('./updateContract')
const cp = require('child_process');
const util = require('util');
const { stdout } = require('process');
const asyncExec = util.promisify(cp.exec)

const exec_options = { 
	encoding: 'utf8', 
	cwd: '/home/preview/keys', 
	env: null,
	timeout: 0,
	maxBuffer: 200 * 1024,
	killSignal: 'SIGTERM'
};

async function initialiseContract(contract) {
  const magic = 2
  const lenderWallet = await Wallet.findById(contract.roles[0].wallet).populate();
  const lenderAddr = lenderWallet.walletAddress
  const lenderKey = lenderWallet.walletSeed
  const marlowe1 = contract.transactions[0].marlowe[0]
  const tx1Signed = contract.transactions[1].tx[0]

  const lenderInit = 'marlowe-cli run auto-execute \
  --marlowe-out-file ' + marlowe1 + ' \
  --change-address ' + lenderAddr + ' \
  --required-signer ' + lenderKey + ' \
  --testnet-magic ' + magic + ' \
  --out-file ' + tx1Signed + ' \
  --submit=600s'

  const send = cp.exec(`${lenderInit}`, exec_options, (err, stdout, stderr) => {
    console.log(stdout)
    console.log(stderr)
    console.log(err)

    const txOut = stdout.toString('utf8')
    console.log(txOut)

    const marloweOut = txOut.substring(6, 70) + '#1'
    console.log(marloweOut)

    updateContract(contract.id, marloweOut)   
    
  })

}

module.exports = initialiseContract