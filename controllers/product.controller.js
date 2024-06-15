const Product = require("../model/Product");

const PAGE_SIZE = 3;

productController = {};

productController.createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      image,
      price,
      category,
      description,
      stock,
      size,
      status,
    } = req.body;
    const product = new Product({
      sku,
      name,
      image,
      price,
      category,
      description,
      stock,
      size,
      status,
    });
    await product.save();
    res.status(200).json({ status: "success", product });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

productController.getProducts = async (req, res) => {
  try {
    const { page, name } = req.query;
    // if(name) {
    //     const products = await Product.find({name: {$regex:name, $options:"i"}})
    // } else {
    //     const products = await Product.find({})
    // }
    const condition = name
      ? { name: { $regex: name, $options: "i" }, isDeleted: false }
      : { isDeleted: false };
    let query = Product.find(condition);
    let response = { status: "success" };
    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Product.find(condition).count();
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }
    const productList = await query.exec();
    response.data = productList;
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

productController.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new Error("Product not found");
    }
    res.status(200).json({ status: "success", data: product });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

productController.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      sku,
      name,
      image,
      price,
      category,
      description,
      stock,
      size,
      status,
    } = req.body;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { sku, name, image, price, category, description, stock, size, status },
      { new: true }
    );
    if (!product) {
      throw new Error("Product not found");
    }
    res.status(200).json({ status: "success", data: product });
  } catch {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

productController.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { isDeleted: true }
    );
    if (!product) throw new Error("Product not found");
    res.status(200).json({ status: "success" });
  } catch (err) {
    return res.status(400).json({ status: "fail", error: err.message });
  }
};

productController.checkStock = async (item) => {
  // 내가 사려는 아이템 재고 정보 들고오기.
  const product = await Product.findById(item.productId);
  // 내가 사려는 아이템 수량, 재고 비교.
  if (product.stock[item.size] < item.qty) {
    // 재고가 불충분하면, 불충분 메세지와 함께 데이터 반환하기.
    return {
      isVerify: false,
      message: `${product.name}의 ${item.size} 재고가 부족합니다.`,
    };
  }
  // 재고가 충분하다면, 재고에서 수량을 빼주고 성공한 결과 반환하기.
  const newStock = { ...product.stock };
  newStock[item.size] -= item.qty;
  product.stock = newStock;

  await product.save();
  return { isVerify: true };
};

productController.checkItemListStock = async (itemList) => {
  // 아이템 전체 체크.
  const insufficientStockItems = []; // 재고가 불충분한 아이템들 저장 예정.
  // 재고 확인 로직.
  // 비동기를 한 번에 처리하고 싶으면? Promise
  await Promise.all(
    itemList.map(async (item) => {
      const stockCheck = await productController.checkStock(item); // 아이템 하나하나 체크.
      if (!stockCheck.isVerify) {
        insufficientStockItems.push({ item, message: stockCheck.message });
      }
      return stockCheck;
    })
  );
  return insufficientStockItems;
};

module.exports = productController;
