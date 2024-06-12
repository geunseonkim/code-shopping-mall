const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    items: [
      {
        productId: {
          type: mongoose.ObjectId,
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
      },
    ],
  },
  { timestamps: true }
);

CartSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  return obj;
};

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
