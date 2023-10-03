const express = require('express');
const router = express.Router();
const controllerProfiles = require('../controllers/controllerProfiles');
const verifyJWT = require('../middleware/verifyJWT');
// const verifyJWTOptional = require('../middleware/verifyJWTOptional.js');

// Get profile - authentication optional
router.get('/profile/:username', controllerProfiles.getProfiles);

// Follow a user
router.post('/profile/:username/follow', verifyJWT, controllerProfiles.followUser);

// unfollow a user
router.delete('/profile/:username/follow', verifyJWT, controllerProfiles.unFollowUser);
module.exports = router;