const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OrderSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    contact: {
        type: Object,
        required: true
    },
    shipTo: {
        type: Object,
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true
    },
    status: {
        type: String,
        default: "preparing"
    },
    items: [{
        productId: {
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
        },
        price: {
            type: Number,
            required: true
        }
    }],
    orderNum: {
        type: String
    }
}, {timestamps: true})

OrderSchema.methods.toJSON = function() {
    const obj = this._doc
    delete obj.updatedAt
    delete obj.createdAt
    delete obj.__v
    return obj
}

const Order = mongoose.model("Order", OrderSchema)
module.exports = Order