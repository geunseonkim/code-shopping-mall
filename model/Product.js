const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    // size: {
    //   type: Array,
    //   required: true,
    // },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: "false",
    },
  },
  { timestamps: true }
);

ProductSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  return obj;
};

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
