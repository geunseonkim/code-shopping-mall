const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CartSchema = Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    items: [{
        productID: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        size: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            default: 1,
            required: true
        }
    }]
}, {timestamps: true})

CartSchema.methods.toJSON = function() {
    const obj = this._doc
    delete obj.updatedAt
    delete obj.createdAt
    delete obj.__v
    return obj
}

const Cart = mongoose.model("Cart", CartSchema)
module.exports = Cart