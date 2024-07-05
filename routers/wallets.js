const {Wallet} = require('../models/wallet');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');
const createKeys = require('../marlowe/createKeys');
const createAddress = require('../marlowe/createAddress');
const updateWalletAddress = require('../marlowe/updateWalletAddress');
const fs = require('fs');
const getBalance = require('../marlowe/getBalance');
const getUtxo = require('../marlowe/getUtxo');
const buildTx	= require('../marlowe/buildTx');
const signTx	= require('../marlowe/signTx');
const submitTx	= require('../marlowe/submitTx');
const queryBalance = require('../marlowe/queryBalance');

// list Wallets
router.get('/', async (req, res) => {
	const walletList = await Wallet.find() //.select('-walletSeed')

	if(!walletList) {
		res.status(500).json({success: false})
	}

	res.send(walletList);
});

// register A Wallet (Admin)
router.post('/', async (req, res) => {
	const userId = await User.findById(req.body.userId);
	if(!userId)
	return res.status(400).send('Invalid User ID');

	let wallet = new Wallet({
	    userId: req.body.user,
	    walletAddress: req.body.walletAddress,
	    walletSeed: CryptoJS.AES.encrypt(JSON.stringify(req.body.walletSeed), 'secret key 123').toString()
	})

	// let wallet = new Wallet({
	// 	userId: req.body.userId,
	// 	walletAddress: req.body.userId + '.addr',
	// 	walletSeed: req.body.userId + '.skey'
	// })

	wallet = await wallet.save();

	if(!wallet)
	return res.status(500).send('The Wallet cannot be created')

	res.send(wallet);
});

// Create A Wallet (User) // Needs to connect with Cardano-wallet to create / derive seed phrase
router.post('/create', async (req, res) => {
	const user = await User.findOne({email: {$eq: req.body.user}});
	if(!user)
	return res.status(400).send('Invalid User ID');

	// const encryptSeed = CryptoJS.AES.encrypt(JSON.stringify(req.body.walletSeed), 'secret key 123').toString();

	const findWallet = await Wallet.findOne({userId: {$eq: user.userId}})
	if(findWallet) {
		const foundWallet = fs.readFileSync('/home/preview/keys/' + user.id + '.addr', 'utf8')
		const updatedWallet = await updateWalletAddress(wallet, foundWallet)
		
		return res.send(updatedWallet)
	}
	
	const keys = await createKeys(user.id)
	const address = await createAddress(user.id)

	// const result = readAddress(req.body.userId)
	// console.log(result)

	let wallet = new Wallet({
		userId: user.id,
		walletAddress: user.id + '.addr',
		walletSeed: user.id + '.skey'
	})

	wallet = await wallet.save();

	if(!wallet)
	return res.status(500).send('The Wallet cannot be created')

	const result = fs.readFileSync(`/home/preview/keys/${user.id}.addr`, 'utf8')
	
	// //readAddress(req.body.userId)
	
	console.log(result)
	const updatedWallet = await updateWalletAddress(wallet, result)
	console.log(updatedWallet)

	return res.send(updatedWallet)
	// return res.send(wallet)

});

router.get('/:id', async (req, res) => {
	const user = await User.findById(req.params.id);
	if(!user)
	return res.status(400).send('Invalid User ID');

	console.log(user)

	const encryptSeed = CryptoJS.AES.encrypt(JSON.stringify(req.body.walletSeed), 'secret key 123').toString();

	const findWallet = await Wallet.findOne({userId: {$eq: req.params.id}})

	if(!findWallet)
	return res.send('No Wallet Available')

	console.log(findWallet)

	const walletAddress = findWallet.walletAddress

	return res.status(200).send(walletAddress)
})

// restore a Wallet (User)
router.get('/restore', async (req, res) => {
	const seed = await req.body.seed;

	const walletSeed = await Wallet.find(CryptoJS.AES.encrypt(JSON.stringify(seed), 'secret key 123').toString())

	if(!walletSeed)
	return res.status(400).send('Invalid Wallet Seed')

	res.send('Wallet Found')
});

// Show Seed Phrase (User)
router.get('/showSeed', async (req, res) => {
	const userWallet = await Wallet.findOne({userId: req.body.userId});

	if(!userWallet)
	return res.status(400).send('User Wallet not found')

	const bytes = CryptoJS.AES.decrypt(userWallet.walletSeed, 'secret key 123');
	const showSeed = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

	res.send(showSeed)
});

router.post('/delete/:id', async (req, res) => {
	const wallet = await Wallet.findByIdAndDelete(req.params.id)

	if(!wallet)
	return res.status(400).send('The Wallet cannot be deleted')

	res.status(200).send('Deleted')
})

router.post('/test', async (req, res) => {
	const userWallet = await Wallet.findOne({userId: req.body.id});

	if(!userWallet)
	return res.status(400).send('User Wallet not found')
	console.log(userWallet)
	const result = readAddress(userWallet)
	console.log(result)
	return res.send(result)
})

router.get('/balance/:id', async (req, res) => {

	const userWallet = await Wallet.findOne({userId: req.params.id});
	if(!userWallet)
	return res.status(400).send('User Wallet not found')
	console.log(userWallet)
	queryBalance(userWallet)

	const utxoFile = userWallet.walletAddress + 'utxos.json'
	
	const walletBalance = getBalance(utxoFile).map((tx) => {
		return Math.floor((tx[1].value.lovelace) / 1000000)
	}).reduce((a, b) => a + b, 0)

	res.send({walletBalance})

})

router.get('/utxo', async (req, res) => {
	
	// const userWallet = await Wallet.findOne({userId: req.params.id});
	// if(!userWallet)
	// return res.status(400).send('User Wallet not found')

	// utxoFile = queryBalance(userWallet)
			
	const utxo = getUtxo()

	res.send(utxo[0])
})

router.post('/send', async (req, res) => {
	const userWallet = await Wallet.findOne({userId: req.body.userId});
	if(!userWallet)
	return res.status(400).send('User Wallet not found')
	
	const userId = req.body.userId
	const userAddress = userWallet.walletAddress
	const recAddress = req.body.rec
	const value = req.body.value

	queryBalance(userWallet)
	
	const utxoFile = userAddress + 'utxos.json'
	const utxo = getUtxo(utxoFile)

	buildTx(utxo[0], userAddress, recAddress, value, userId)

	// res.send(userId + ' sent ' + value + ' to ' + recAddress)

	res.send(userId + ' please Sign Tx and Submit')

})

router.post('/sign', (req, res) => {
	const userId = req.body.userId

	signTx(userId)

	res.send(userId + 'Tx Signed, ready to submit')

})

router.post('/submit', (req, res) => {
	const userId = req.body.userId

	submitTx(userId)

	res.send(userId + ' submitted the Tx to the blockchain')

})

module.exports = router;

// Decrypt
// const bytes  = CryptoJS.AES.decrypt(walletSeed, 'secret key 123');
// const decryptedSeed = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));