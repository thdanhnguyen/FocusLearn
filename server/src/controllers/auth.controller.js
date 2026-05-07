const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library'); // Thư viện verify Google token
const UserModel = require('../models/user.models');
const { success, error } = require('../utils/response');

// Khởi tạo Google OAuth client với Client ID từ env
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password || !displayName) {
      return error(res, "Bạn vui lòng nhập đầy đủ thông tin (email, password, displayName)", 400);
    }
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return error(res, "Email này đã được sử dụng", 409);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.create({
      email, password: hashedPassword, displayName, avatarUrl: null
    });
    return success(res, newUser, "Đăng ký thành công", 201);
  } catch (err) {
    console.error('[auth.register]', err);
    error(res, "Có lỗi xảy ra", 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, "Vui lòng nhập email và password", 400);

    const user = await UserModel.findByEmail(email);
    if (!user) return error(res, "Tài khoản không tồn tại", 401);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return error(res, 'Mật khẩu không chính xác', 401);

    const payload = { id: user.id, email: user.email, displayName: user.display_name, avatarUrl: user.avatar_url };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return success(res, { token, user: payload }, "Đăng nhập thành công", 200);
  } catch (err) {
    console.error('[auth.login]', err);
    error(res, "Có lỗi xảy ra", 500);
  }
};

// ============================================================
// GOOGLE OAUTH ENDPOINT
// Luồng: Frontend gửi lên "credential" (ID token từ Google)
//        → Backend verify với Google server
//        → Tìm hoặc tạo user trong DB
//        → Trả JWT của hệ thống mình (giống login thường)
// ============================================================
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return error(res, "Thiếu Google credential", 400);

    // Verify token với Google - Google sẽ báo nếu token bị giả mạo hoặc hết hạn
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const googlePayload = ticket.getPayload();

    // Lấy thông tin từ tài khoản Google của user
    const { email, name, picture, sub: googleId } = googlePayload;

    // Tìm xem user đã tồn tại trong DB chưa
    let user = await UserModel.findByEmail(email);

    if (!user) {
      // Nếu chưa có → tạo tài khoản mới (không cần password cho Google user)
      // password_hash để null vì họ không dùng email/password thông thường
      user = await UserModel.create({
        email,
        password: null,       // Google user không có password
        displayName: name,
        avatarUrl: picture,
      });
    }

    // Tạo JWT hệ thống và trả về giống như login thường
    const payload = { id: user.id, email: user.email, displayName: user.display_name, avatarUrl: user.avatar_url };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return success(res, { token, user: payload }, "Đăng nhập Google thành công", 200);

  } catch (err) {
    console.error('[auth.googleAuth]', err);
    // Lỗi này thường do token Google không hợp lệ
    error(res, "Google token không hợp lệ hoặc đã hết hạn", 401);
  }
};
