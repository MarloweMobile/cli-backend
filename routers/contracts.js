const {Contract} = require('../models/contract');
const {Wallet} = require('../models/wallet');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const designContract = require('../marlowe/designContract');
const createContract = require('../marlowe/createContract');
const createContractFiles = require('../marlowe/createContractFiles');
const initialiseContract = require('../marlowe/initialiseContract');
const lenderPrepare = require('../marlowe/lenderPrepare');
const borrowerPrepare = require('../marlowe/borrowerPrepare');
const lenderDeposit = require('../marlowe/lenderDeposit');
const borrowerDeposit = require('../marlowe/borrowerDeposit');
const checkSignature = require('../marlowe/checkSignature');


// list Contracts
router.get('/', async (req, res) => {
    const contractList = await Contract.find().populate()

    if(!contractList) {
        res.status(500).json({success: false})
    }

    contractList.filter()
    
    res.send(contractList);
});

// list Contracts
router.get('/user/:id', async (req, res) => {
    const contractList = await Contract.find().populate()
    if(!contractList) {
        res.status(500).json({success: false})
    }
    
    let filteredList = []
    
    contractList.forEach((contract) => {
        if(contract.name) {
            filteredList.push(contract);
        }
    })
    
    console.log(filteredList[0], filteredList[1], filteredList[2])
    res.send(filteredList);
});

// register A Wallet (Admin)
// router.post('/', async (req, res) => {
//     const userId = await User.findById(req.body.userId);
//     if(!userId)
//     return res.status(400).send('Invalid User ID');

//     let contract = new Contract({
//         userId: req.body.user,
        
//     })

//     contract = await contract.save();

//     if(!contract)
//     return res.status(500).send('The Contract cannot be created')

//     res.send(contract);
// });

// Create A Contract (User) 
router.post('/create', async (req, res) => {
    console.log(req.body)
    const role1Id = await User.findById(req.body.lenderId);
    if(!role1Id)
    return res.status(400).send('Invalid Role1 User ID');

    const role2Id = await User.findById(req.body.borrowerId);
    if(!role2Id)
    return res.status(400).send('Invalid Role2 User ID');

    const role1Wallet = await Wallet.findOne({userId: role1Id}).populate();
    const role2Wallet = await Wallet.findOne({userId: role2Id}).populate();
    
    const now = ((new Date().getTime())*1000);
    // const hour = 60*60*1000;
    const lenderDeadline = req.body.lenderDeadline;
    const borrowerDeadline = req.body.borrowerDeadline;

    let contract = new Contract({
        name: req.body.name,
        contractFiles: {
            contractFile: now + 'contract.json',
            contractState: now + 'state.json',
            marloweFile: now + 'marlowe',
            tx: now + 'tx',
        },         
        roles: [{
            name: 'lender',
            userId: role1Id.id,
            wallet: role1Wallet,
            deadline: lenderDeadline,
            value: req.body.lenderValue*1000000,
        },
        {
            name: 'borrower',
            userId: role2Id.id,
            wallet: role2Wallet,
            deadline: borrowerDeadline,
            value: req.body.borrowerValue*1000000,
        }]
    })

    console.log(contract)
    contract = await contract.save();

    if(!contract)
    return res.status(500).send('The Contract cannot be created')

    const updatedContract = await createContractFiles(contract);
    
    const designContract = await designContract(updatedContract)
    const createContract = await createContract(updatedContract)

    res.send(createContract);
});

router.get('/:id', async (req, res) => {
    const contract = await Contract.findById(req.params.id).populate();
    if(!contract)
    return res.status(400).send('Invalid Contract ID');

    res.send(contract);
});

// initialise contract
router.post('/:id/initialise', async (req, res) => {
    const contract = await Contract.findById(req.params.id).populate();
    if(!contract)
    return res.status(400).send('Invalid Contract ID');

    const reqSignature = await Wallet.findById(contract.roles[0].wallet).populate();

    const signature = await checkSignature(reqSignature, req.body.signature)

    if (signature === true) {
        const init = await initialiseContract(contract);
        res.send(init);
    } else {
        res.send('Invalid Signature');
    }
    
});

// lenderPrepare
router.post('/:id/lenderPrepare', async (req, res) => {
    const contract = await Contract.findById(req.params.id).populate();
    if(!contract)
    return res.status(400).send('Invalid Contract ID');

    const reqSignature = await Wallet.findById(contract.roles[0].wallet).populate();

    const signature = await checkSignature(reqSignature, req.body.signature)

    if (signature === true) {
        lenderPrepare(contract);
        res.send(contract);
    } else {
        res.send('Invalid Signature');
    }

});

//lenderDepoist
router.post('/:id/lenderDeposit', async (req, res) => {
    const contract = await Contract.findById(req.params.id).populate();
    if(!contract)
    return res.status(400).send('Invalid Contract ID');

    const reqSignature = await Wallet.findById(contract.roles[0].wallet).populate();

    const signature = await checkSignature(reqSignature, req.body.signature)

    if (signature === true) {
        lenderDeposit(contract);
        res.send(contract);
    } else {
        res.send('Invalid Signature');
    }

});

//Borrower Prepare
router.post('/:id/borrowerPrepare', async (req, res) => {
    const contract = await Contract.findById(req.params.id).populate();
    if(!contract)
    return res.status(400).send('Invalid Contract ID');

    const reqSignature = await Wallet.findById(contract.roles[1].wallet).populate();

    const signature = await checkSignature(reqSignature, req.body.signature1)

    if (signature === true) {
        borrowerPrepare(contract);
        res.send(contract);
    } else {
        res.send('Invalid Signature');
    }
    
    
});

// Borrower Deposit
router.post('/:id/borrowerDeposit', async (req, res) => {
    const contract = await Contract.findById(req.params.id).populate();
    if(!contract)
    return res.status(400).send('Invalid Contract ID');

    const reqSignature = await Wallet.findById(contract.roles[1].wallet).populate();

    const signature = await checkSignature(reqSignature, req.body.signature1)

    if (signature === true) {
        borrowerDeposit(contract);
        res.send(contract);
    } else {
        res.send('Invalid Signature');
    }

});




module.exports = router;
