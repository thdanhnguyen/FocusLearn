const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.models')
const {success, error} = require('../utils/response')

exports.register = async (req, res) =>{
  try{
    const {email, password, displayName} = req.body;

    if (!email || !password || !displayName){
      return error(res, "Bạn vui lòng nhập đầy đủ thông tin (email, password, displayName)", 400);
    }
    const existingUser = await UserModel.findByEmail(email);
    if(existingUser){
      return error(res, "Email này đã được sử dụng", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      displayName,
      avatarUrl: null
    });
    return success(res, newUser, "Đăng ký thành công", 201);
  }catch(err){
    error(res, "Có lỗi xảy ra", 500);
  }
}
exports.login = async (req, res) =>{
  try{
    const {email, password} = req.body;
    
    if (!email || !password)
      return error(res, "Bạn vui lòng nhập email và password", 400);

    const user = await UserModel.findByEmail(email);
    if (!user) return error(res, "Tài khoản không tồn tại", 401);
    
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch){
      return error(res, 'Mật khẩu không chính xác', 401)
    }

    const payload = {
      id: user.id,
      email: user.email,
      display: user.displayName,
      avatarUrl: user.avatar_url
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {expiresIn: '1d'}
    );
    return success(res, {token, user: payload}, "Đăng nhập thành công", 200);
  }catch(err){
    error(res, "Có lỗi xảy ra", 500);
  }
}
