const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// get list of users
router.get('/', async (req, res) => {
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    }

    res.send(userList);
});

// create a user (Admin)
router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('The User cannot be created')

    res.send(user);
});

// Get User by ID
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: "The User with the given ID was not found"})
    }
    res.status(200).send(user);
});

// User login
router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.SECRET;

    if(!user) {
        return res.status(400).send('User not found')
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}
        )
        
        res.status(200).send({user: user.id, token: token})
    } else {
        res.status(400).send('Incorrect Password')
    }

});

// User register
router.post(`/register`, async (req, res) => {
    const salt = bcrypt.genSaltSync(10)

    let user = new User({
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, salt),
        isAdmin: false
    })

    user = await user.save();

    if(!user)
    return res.status(400).send('The User cannot be created')

    // const newUser = await User.findOne({email: req.body.email})
    // const secret = process.env.SECRET;

    // const token = jwt.sign(
    //     {
    //         userId: newUser.id,
    //         isAdmin: newUser.isAdmin
    //     },
    //     secret,
    //     {expiresIn: '1d'}
    // )

    // res.send({user: user.id, token: token});

    res.send(user);
});

// User Delete
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if(!user) {
            return res.status(404).json({succuess: false, message: "user not found"})
        } else {
            return res.status(200).json({success: true, message: "the user is deleted"})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
});

module.exports = router;