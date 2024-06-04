const express = require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")
const authController = require("../controllers/auth.controller")

router.post('/', userController.createUser);
router.get('/me', authController.authenticate, userController.getUser);
// check the token is valid, find the user with token and return

module.exports = router