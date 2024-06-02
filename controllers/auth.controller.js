const jwt = require("jsonwebtoken")
const User = require("../model/User")
const bcrypt = require("bcryptjs")
require("dotenv").config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

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

authController.authenticate = (req, res, next) => {
    try{
        const tokenString = req.headers.authorization
        if(!tokenString) {
            throw new Error ("Token is not valid")
        }
        const token = tokenString.replace("Bearer ", "")
        jwt.verify(token, JWT_SECRET_KEY, (err, payload) =>{
            if(err) {
                throw new Error ("invalid token")
            }
            req.userID=payload._id
        } )
        next()
    } catch (err) {
        res.status(400).json({status: "fail", error: err.message})
    }
}

module.exports = authController