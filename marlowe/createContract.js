const cp = require('child_process')

const exec_options = { 
	encoding: 'utf8', 
	cwd: '/home/preview/keys', 
	env: null,
	timeout: 0,
	maxBuffer: 200 * 1024,
	killSignal: 'SIGTERM'
};

function createContract(contract) {
  const magic = 2
  const zcbContract = contract.contractFiles.contractFile
  const zcbState = contract.contractFiles.contractState
  const marlowe1 = contract.transactions[0].marlowe[0]

  const createMarloweFile = 'marlowe-cli run initialize \
  --permanently-without-staking \
  --testnet-magic ' + magic + ' \
  --contract-file ' + zcbContract + ' \
  --state-file ' + zcbState + ' \
  --out-file ' + marlowe1
  
  cp.exec(`${createMarloweFile}`, exec_options, (err, stdout, stderr) => {
    console.log(stdout)
    console.log(err)
    console.log(stderr)
  })
  
  console.log('marlowe-cli run initialize \
    --permanently-without-staking \
    --testnet-magic ' + magic + ' \
    --contract-file ' + zcbContract + ' \
    --state-file ' + zcbState + ' \
    --out-file ' + marlowe1)
}

module.exports = createContract