function queryAddress(addr) {

  const socket = '/node.socket'
  const magic = 2
  

  console.log('cardano-cli query utxo --address ' + addr + ' --testnet-magic ' + magic + ' --socket-path ' + socket).toString().trim()

}

module.exports = queryAddress