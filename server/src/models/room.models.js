const db = require('../config/db');

exports.findAll = async () => {
  const result = await db.query('SELECT * FROM rooms WHERE is_public = true');
  return result.rows;
};
