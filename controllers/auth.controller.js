const User = require("../model/User");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const authController = {};

authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = user.generateToken();
        return res.status(200).json({ status: "success", user, token });
      }
    }
    throw new Error("invalid email or password");
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

authController.loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const { email, name } = ticket.getPayload();
    console.log("google-email, name ", email, name);
    // google auth library: node.js client
    // 4. 백엔드에서 로그인 하기.
    //   a. 이미 로그인을 한 적이 있는 유저 -> 로그인 시키고, 토큰값 주기.
    //   b. 처음 로그인을 시도한 유저 -> 유저 정보를 새로 생성하고, 토큰값 주기.
    let user = await User.findOne({ email });
    if (!user) {
      // 유저를 새로 생성.
      const randomPassword = "" + Math.floor(Math.random() * 100000000);
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(randomPassword, salt);
      user = new User({ name: name, email: email, password: newPassword });
      await user.save();
    }
    // 토큰 발행 리턴.
    const sessionToken = await user.generateToken();
    res.status(200).json({ status: "success", user, token: sessionToken });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

authController.authenticate = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      throw new Error("Token is not found");
    }
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        throw new Error("invalid token", error.message);
      }
      req.userId = payload._id;
      next();
      // const {userId} = req
      // console.log("uuuu", userId)
    });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

authController.checkAdminPermission = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (user.level !== "admin") {
      throw new Error("you don't have a permission");
    }
    next();
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

module.exports = authController;
