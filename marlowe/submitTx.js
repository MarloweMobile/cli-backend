const cp = require('node:child_process');

const exec_options = { 
  encoding: 'utf8', 
  cwd: '/home/preview/keys', 
  env: null,
  timeout: 0,
  maxBuffer: 200 * 1024,
  killSignal: 'SIGTERM'
};

async function submitTx(userId) {

  const submitTx = 'cardano-cli transaction submit --testnet-magic 2 --tx-file ' + userId + '.signed'

  cp.exec(`${submitTx}`, exec_options, (error, stdout, stderr) => {
    console.log(stdout)
  });


  console.log('cardano-cli transaction submit --testnet-magic 2 --tx-file ' + userId + '.signed')
}

module.exports = submitTx