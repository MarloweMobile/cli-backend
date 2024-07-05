const cp = require('node:child_process');

const exec_options = { 
  encoding: 'utf8', 
  cwd: '/home/preview/keys', 
  env: null,
  timeout: 0,
  maxBuffer: 200 * 1024,
  killSignal: 'SIGTERM'
};

async function createAddress(userId) {

  const createAddr = 'cardano-cli address build --payment-verification-key-file ' + userId + '.vkey --out-file ' + userId + '.addr --testnet-magic 2'

  cp.exec(`${createAddr}`, exec_options, (error, stdout, stderr) => {
    console.log(stdout)
  });


  console.log('cardano-cli address build \
  --payment-verification-key-file ' + userId + '.vkey \
  --out-file ' + userId + '.addr \
  --testnet-magic 2')
}

module.exports = createAddress