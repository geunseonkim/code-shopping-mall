const Cart = require("../model/Cart");

const cartController = {};

cartController.addItemToCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, size, qty } = req.body;

    if (!userId) {
      throw new Error("userId가 없습니다.");
    }

    // console.log("addItemToCart에서 받은 userId:", userId); // userId가 제대로 전달되었는지 로그로 확인

    // 유저를 가지고 카트 찾기
    let cart = await Cart.findOne({ userId: userId });
    // console.log("사용자 ID:", userId);
    // console.log("기존 카트:", cart);

    // 유저가 만든 카트가 없으면 만들어주기
    if (!cart) {
      cart = new Cart({ userId: userId });
      await cart.save();
      // console.log("새로 생성된 카트:", cart);
    }

    // 카트에 이미 들어간 아이템(productId, size)이면 에러("이미 존재하는 아이템")
    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size
    );
    // console.log("기존 아이템:", existItem);

    if (existItem) {
      throw new Error("already existed Item");
    }

    // 카트에 새로운 아이템이면 아래사항.
    // 카트에 아이템을 추가하기
    cart.items = [...cart.items, { productId: productId, size, qty }];
    await cart.save();
    // console.log("카트 아이템 길이:", cart.items.length);

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
    res.status(200).json({ status: 200, cartItemQty: cart.items.length });
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
    res.status(200).json({ status: 200, data: cart.items });
  } catch (err) {
    return res.status(400).json({ status: "fail", err: error.message });
  }
};

cartController.getCartQty = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) throw new Error("There is no cart!");
    res.status(200).json({ status: 200, qty: cart.items.length });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = cartController;
