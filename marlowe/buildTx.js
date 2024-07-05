const cp = require('node:child_process');

const exec_options = { 
  encoding: 'utf8', 
  cwd: '/home/preview/keys', 
  env: null,
  timeout: 0,
  maxBuffer: 200 * 1024,
  killSignal: 'SIGTERM'
};

async function buildTx(utxo, userAddress, recAddress, value, userId) {

  const buildTx = 'cardano-cli transaction build --babbage-era --testnet-magic 2 --tx-in ' + utxo + ' --tx-out ' + recAddress + '+' + value + ' --change-address ' + userAddress + ' --out-file ' + userId + '.raw'

  cp.exec(`${buildTx}`, exec_options, (error, stdout, stderr) => {
    console.log(stdout)
  });


  console.log(buildTx)
}

module.exports = buildTx