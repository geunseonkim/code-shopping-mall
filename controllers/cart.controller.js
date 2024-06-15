const Cart = require("../model/Cart");

const cartController = {};

cartController.addItemToCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, size, qty } = req.body;
    if (!userId) {
      throw new Error("userId가 없습니다.");
    }
    let cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      cart = new Cart({ userId: userId });
      await cart.save();
    }
    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size
    );
    if (existItem) {
      throw new Error("already existed Item");
    }
    cart.items = [...cart.items, { productId: productId, size, qty }];
    await cart.save();
    return res
      .status(200)
      .json({ status: "success", data: cart, cartItemQty: cart.items.length });
  } catch (err) {
    return res.status(400).json({ status: "fail", error: err.message });
  }
};

cartController.getCart = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) {
      throw new Error("userId가 없습니다.");
    }
    const cart = await Cart.findOne({ userId: userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });
    if (!cart) {
      throw new Error("카트가 비어있습니다.");
    }
    return res.status(200).json({
      status: "success",
      data: cart.items,
      cartItemQty: cart.items.length,
    });
  } catch (err) {
    return res.status(400).json({ status: "fail", error: err.message });
  }
};

cartController.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const cart = await Cart.findOne({ userId });
    cart.items = cart.items.filter((item) => !item._id.equals(id));
    await cart.save();
    res.status(200).json({ status: "success", cartItemQty: cart.items.length });
  } catch (err) {
    return res.status(400).json({ status: "fail", error: err.message });
  }
};

cartController.editCartItem = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const { qty } = req.body;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });
    if (!cart) throw new Error("There is no cart for this user");
    const index = cart.items.findIndex((item) => item._id.equals(id));
    if (index === -1) throw new Error("Can not find item");
    cart.items[index].qty = qty;
    await cart.save();
    res.status(200).json({ status: "success", data: cart.items });
  } catch (err) {
    return res.status(400).json({ status: "fail", error: err.message });
  }
};

cartController.getCartQty = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) throw new Error("There is no cart!");
    res.status(200).json({ status: 200, qty: cart.items.length });
  } catch (err) {
    return res.status(400).json({ status: "fail", error: err.message });
  }
};

module.exports = cartController;
