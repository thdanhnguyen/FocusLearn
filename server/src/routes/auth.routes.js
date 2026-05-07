const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
// Endpoint nhận Google credential từ Frontend và trả về JWT
router.post('/google', authController.googleAuth);

module.exports = router;
