const util = require('node:util');
const cp = require('node:child_process');

const exec_options = { 
  encoding: 'utf8', 
  cwd: '/home/preview/keys', 
  env: null,
  timeout: 0,
  maxBuffer: 200 * 1024,
  killSignal: 'SIGTERM'
};

async function createKeys(userId) {

  const createKeys = 'cardano-cli address key-gen --verification-key-file ' + userId + '.vkey --signing-key-file ' + userId + '.skey'

  cp.exec(`${createKeys}`, exec_options, (error, stdout, stderr) => {
    console.log(stdout)
  });

  console.log('cardano-cli address key-gen \
  --verification-key-file ' + userId + '.vkey \
  --signing-key-file ' + userId + '.skey')
}

module.exports = createKeys