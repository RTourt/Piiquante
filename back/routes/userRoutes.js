const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/userControllers');

//  routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//  exportation du router
module.exports = router;