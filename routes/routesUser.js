const express = require('express');

const router = express.Router()

const Model = require('../models/user');

//Post Method
router.post('/postUser', async (req, res) => {
    const data = new Model({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        bio: req.body.bio,
        image: req.body.image,
        subscriptions: req.body.subscriptions
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

// GET Method
router.get('/getAllUsers', async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;