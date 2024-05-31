const User = require("../model/User")
const bcrypt = require("bcryptjs")

userController = {}

userController.createUser = async(req, res) => {
    try {
        const {name, email, password, level} = req.body
        const user = await User.findOne({email})
        if (user) {
            throw new Error ("you're already registered user.")
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const newUser = User({name, email, password:hash, level})
        await newUser.save()
        res.status(200).json({status: "success"})
    } catch (err) {
        res.status(400).json({status: "fail", error: err.message})
    }
}

module.exports = userController