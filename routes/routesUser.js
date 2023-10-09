const express = require('express');
const router = express.Router();
const controllerUser = require('../controllers/controllerUser');
const verifyJWT = require('../middleware/verifyJWT');

// Registration user
router.post('/user', controllerUser.registerUser);
// Show All Users
router.get('/user/all', controllerUser.showUsers);
// Current Subscription
router.get('/user/current', verifyJWT, controllerUser.showUserById);
// Update user
router.put('/user/update', verifyJWT, controllerUser.updateUser);
// Current logged user
router.post('/user/login',controllerUser.userLogin);

module.exports = router;