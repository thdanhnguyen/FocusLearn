const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, roomController.getAllRooms);
router.post('/', verifyToken, roomController.createRoom);

module.exports = router;
