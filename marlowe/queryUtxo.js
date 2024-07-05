const cp = require('node:child_process');

const exec_options = { 
  encoding: 'utf8', 
  cwd: '/home/preview/keys', 
  env: null,
  timeout: 0,
  maxBuffer: 200 * 1024,
  killSignal: 'SIGTERM'
};

function queryUtxo(tx) {

  const magic = 2

  const queryUtxo = 'cardano-cli query utxo --testnet-magic ' + magic + ' --tx-in ' + tx

  cp.exec(`${queryUtxo}`, exec_options, (error, stdout, stderr) => {
    console.log(stdout)
  });
  
  console.log('cardano-cli query utxo --testnet-magic ' + magic + ' --tx-in ' + tx)

}

module.exports = queryUtxo