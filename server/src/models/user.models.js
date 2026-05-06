const db = require('../config/db');

exports.findByEmail = async(email) =>{
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1', [email]
  );
  return result.rows[0];
}
exports.create = async(userData) =>{
  const {email, password, displayName, avatarUrl} = userData;
  
  const result = await db.query(
    `INSERT INTO users (email, password_hash, display_name, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, display_name, avatar_url, created_at`,
    [email, password, displayName, avatarUrl]
  );
  return result.rows[0];
}
