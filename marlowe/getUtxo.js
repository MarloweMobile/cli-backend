function getUtxo(utxoFile) {

  const utxoF = require('/home/preview/keys/' + utxoFile)

  let utxo = Object.entries(utxoF);
  let tx = Object(utxo);
  console.log(tx[0]);

  console.log(tx);

  return tx[0];
}

module.exports = getUtxo;