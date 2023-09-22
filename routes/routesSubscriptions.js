const express = require('express');

const router = express.Router();

const subscriptions = require('../models/subscriptions');
const subsController = require('../controllers/controllerSubscriptions');

// //Post Method
// router.post('/postSub', async (req, res) => {
//     const data = new Model({
//         title: req.body.title,
//         status: req.body.status,
//         price: req.body.price,
//         articleCount: req.body.articleCount
//     })

//     try {
//         const dataToSave = await data.save();
//         res.status(200).json(dataToSave)
//     }
//     catch (error) {
//         res.status(400).json({message: error.message})
//     }
// })

// // GET Method
// router.get('/getAllSub', async (req, res) => {
//     try{
//         const data = await Model.find();
//         res.json(data)
//     }
//     catch(error){
//         res.status(500).json({message: error.message})
//     }
// })

// //Delete by ID Method
// router.delete('/deleteSub/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const data = await Model.findByIdAndDelete(id)
//         res.send(`Subscription ${data.name} has been deleted..`)
//     }
//     catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// })

router.post('/subs', subsController.addSubscription);

router.put('/subs/:id',subsController.updateSubscription);

router.delete('/subs/:id',subsController.deleteSubscription);

router.get('/subs/all',subsController.showSubscriptions);

router.get('/subs/:id',subsController.showById);

module.exports = router;