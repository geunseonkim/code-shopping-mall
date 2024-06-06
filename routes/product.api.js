const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const productController = require("../controllers/product.controller")

router.post("/", authController.authenticate, authController.checkAdminPermission, productController.createProduct)
// 상품은 누구나 다 만들 수 없다!
router.get("/", productController.getProducts)
router.get("/:id", productController.getProductById)

module.exports = router