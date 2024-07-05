const {Contract} = require('../models/contract')

async function updateContract(contractId, txId) {
  const contract = await Contract.findByIdAndUpdate(contractId, {
    stateTx: txId
  }, {new: true})

  console.log(contract)
}

module.exports = updateContract