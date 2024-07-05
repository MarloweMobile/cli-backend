const { Contract } = require('../models/contract')

async function createContractFiles(contract) {
  const marloweTransactions = [contract.contractFiles.marloweFile + '1.json', contract.contractFiles.marloweFile + '2.json', contract.contractFiles.marloweFile + '3.json']
  const transactions = [contract.contractFiles.tx + '1.signed', contract.contractFiles.tx + '2.signed', contract.contractFiles.tx + '3.signed']
  
  const updatedContractFiles = await Contract.findByIdAndUpdate(contract.id, {
    transactions: [{
      marlowe: marloweTransactions,
    },
    {
      tx: transactions,
    }]
  }, {new: true})

  return updatedContractFiles

}

module.exports = createContractFiles