const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        default: "customer" // 2types: customer, admin
    }
}, {timestamps: true})

UserSchema.methods.toJSON = function() {
    const obj = this._doc
    delete obj.password
    delete obj.__v
    delete obj.updatedAt
    delete obj.createdAt
    return obj
}

const User = mongoose.model("User", UserSchema)
module.exports = User