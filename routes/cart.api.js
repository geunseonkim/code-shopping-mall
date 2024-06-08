const express = require("express")
const authController = require("../controllers/auth.controller")
const router = express.Router()
const cartController = require("../controllers/cart.controller")

router.post("/", authController.authenticate, cartController.addItemToCart);
router.get("/", authController.authenticate, cartController.getCart);

module.exports = router