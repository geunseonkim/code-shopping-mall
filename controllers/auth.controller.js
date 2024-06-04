const User = require("../model/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
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

authController.authenticate = async(req, res, next) => {
    try{
        const tokenString = req.headers.authorization
        if(!tokenString) {
            throw new Error ("Token is not found")
        }
        const token = tokenString.replace("Bearer ","")
        jwt.verify(token, JWT_SECRET_KEY, (error, payload) =>{
            if(error) {
                throw new Error ("invalid token", error.message)
            }
            req.userId = payload._id
            next()
            // const {userId} = req
            // console.log("uuuu", userId)
        })
    } catch (err) {
        res.status(400).json({status: "fail", error: err.message})
    }
}

authController.checkAdminPermission = async(req, res, next) => {
    try{
        const {userId} = req
        const user = await User.findById(userId)
        if (user.level !== "admin") {
            throw new Error ("you don't have a permission")
        }
        next()
    } catch (err) {
        res.status(400).json({status: "fail", error: err.message})
    }
}

module.exports = authController