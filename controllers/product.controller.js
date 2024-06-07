const Product = require("../model/Product")

const PAGE_SIZE = 3

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

productController.getProducts = async(req, res) => {
    try{
        const {page, name} = req.query
        // if(name) {
        //     const products = await Product.find({name: {$regex:name, $options:"i"}})
        // } else {
        //     const products = await Product.find({})
        // }
        const condition = name? {name:{$regex: name, $options:"i"}, isDeleted: false }: { isDeleted: false };
        let query = Product.find(condition)
        let response = {status: "success"}
        if (page) {
            query.skip((page-1)*PAGE_SIZE).limit(PAGE_SIZE)
            // 최종 몇 개 페이지 (=전체 페이지)
            // 데이터가 총 몇 개 있는지.
            const totalItemNum = await Product.find(condition).count()
            // 데이터의 총 갯수 / PAGE_SIZE
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE)
            response.totalPageNum = totalPageNum
        }
        const productList = await query.exec()
        response.data = productList
        res.status(200).json(response)
    } catch (err) {
        res.status(400).json({status: "fail", error: err.message})
    }
}

productController.getProductById = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            throw new Error ("Product not found")
        }
        res.status(200).json({status: "success", data: product})
    } catch (err) {
        res.status(400).json({status: "fail", error: err.message});
    }
}

productController.updateProduct = async(req, res) => {
    try {
        const productId = req.params.id
        const {sku, name, image, price, category, description, stock, size, status} = req.body
        const product = await Product.findByIdAndUpdate({_id:productId}, {sku, name, image, price, category, description, stock, size, status}, {new: true})
        if (!product) {
            throw new Error ("Product not found")
        }
        res.status(200).json({status: "success", data: product})
    } catch {
        res.status(400).json({status: "fail", error: err.message});
    }
}

productController.deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id
      const product = await Product.findByIdAndUpdate({ _id: productId }, { isDeleted: true })
      if (!product) throw new Error("Product not found")
      res.status(200).json({ status: "success" })
    } catch (err) {
      return res.status(400).json({ status: "fail", error: err.message })
    }
  };


module.exports = productController
