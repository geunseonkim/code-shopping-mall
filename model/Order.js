const mongoose = require("mongoose");
const orderController = require("../controllers/order.controller");
const Cart = require("./Cart");
const Schema = mongoose.Schema;

const OrderSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    contact: {
      type: Object,
      required: true,
    },
    shipTo: {
      type: Object,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      default: "preparing",
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        size: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          default: 1,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    orderNum: {
      type: String,
    },
  },
  { timestamps: true }
);

OrderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  return obj;
};

OrderSchema.post("save", async function () {
  // 카트 비우기.
  const cart = await Cart.findOne({ userId: this.userId });
  cart.items = [];
  await cart.save();
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
