const orderController = {};
const Order = require("../model/Order");
const { randomStringGenerator } = require("../utils/randomStringGenerator");
const PAGE_SIZE = 5;

orderController.createOrder = async (req, res) => {
  try {
    // 프론트엔드에서 데이터 보낸 거 받아오기. (userId, totalPrice, shipTo, contact, orderList)
    const { userId } = req;
    const { shipTo, contact, totalPrice, orderList } = req.body;
    // 재고 확인 / 재고 업데이트.
    const insufficientStockItems = await productController.checkItemListStock(
      orderList
    );
    // 재고가 충분하지 않은 아이템이 있으면 에러를 던지기.
    if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems.reduce(
        (total, item) => (total += item.message),
        ""
      );
      throw new Error(errorMessage);
    }
    // order를 만들기.
    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomStringGenerator(),
    });
    await newOrder.save();
    // save 후에 카트 비우기.
    res.status(200).json({ status: "success", orderNum: newOrder.orderNum });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

orderController.getOrder = async (req, res, next) => {
  try {
    const { userId } = req;
    const orderList = await Order.find({ userId: userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
        select: "image name",
      },
    });
    const totalItemNum = await Order.find({ userId: userId }).count();

    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    res.status(200).json({ status: "success", data: orderList, totalPageNum });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.getOrderList = async (req, res, next) => {
  try {
    const { page, orderNum } = req.query;

    let condition = {};
    if (orderNum) {
      condition = {
        orderNum: { $regex: orderNum, $options: "i" },
      };
    }

    const orderList = await Order.find(condition)
      .populate("userId")
      .populate({
        path: "items",
        populate: {
          path: "productId",
          model: "Product",
          select: "image name",
        },
      })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);
    const totalItemNum = await Order.find(condition).count();
    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    res.status(200).json({ status: "success", data: orderList, totalPageNum });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!order) throw new Error("Can't find order");
    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;
