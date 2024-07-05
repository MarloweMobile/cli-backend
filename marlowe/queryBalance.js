const cp = require('node:child_process');

function queryBalance(wallet) {

  const exec_options = { 
    encoding: 'utf8', 
    cwd: '/home/preview/keys', 
    env: null,
    timeout: 0,
    maxBuffer: 200 * 1024,
    killSignal: 'SIGTERM'
  };

  const address = wallet.walletAddress
  const utxoFile = address + 'utxos.json'

  const queryAddr = 'cardano-cli query utxo --address ' + address + ' --testnet-magic 2 --out-file ' + utxoFile

  cp.exec(`${queryAddr}`, exec_options, (error, stdout, stderr) => {
    console.log(stdout)
  });

  console.log(utxoFile)

  console.log('cardano-cli query utxo \
  --address ' + address + ' \
  --testnet-magic 2 \
  --out-file ' + utxoFile)
} 

module.exports = queryBalance