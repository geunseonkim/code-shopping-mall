const User = require("../model/User")
const bcrypt = require("bcryptjs")

const authController = {}

authController.loginWithEmail = async(req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if(isMatch) {
                const token = user.generateToken();
                return res.status(200).json({status: "success", user, token})
            }
        }
        throw new Error ("invalid email or password")
    } catch (err) {
        res.status(400).json({status: "fail", error: err.message})
    }
}

module.exports = authController