const Product = require("../model/Product")

productController = {}

productController.createProduct = async(req, res) => {
    try{
        const {sku, name, image, price, category, description, stock, size, status} = req.body
        const product = new Product({sku, name, image, price, category, description, stock, size, status})
        await product.save()
        res.status(200).json({status: "success", product})
    } catch (err) {
        res.status(400).json({status: "fail", error: err.message})
    }
}


module.exports = productController
