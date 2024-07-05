const cp = require('node:child_process');

const exec_options = { 
  encoding: 'utf8', 
  cwd: '/home/preview/keys', 
  env: null,
  timeout: 0,
  maxBuffer: 200 * 1024,
  killSignal: 'SIGTERM'
};

async function signTx(userId) {

  const signTx = 'cardano-cli transaction sign --tx-body-file ' + userId + '.raw --signing-key-file ' + userId + '.skey --testnet-magic 2 --out-file ' + userId + '.signed'

  cp.exec(`${signTx}`, exec_options, (error, stdout, stderr) => {
    console.log(stdout)
  });


  console.log('cardano-cli transaction sign \
    --tx-body-file ' + userId + '.raw \
    --signing-key-file ' + userId + '.skey \
    --testnet-magic 2 \
    --out-file ' + userId + '.signed')
}

module.exports = signTx