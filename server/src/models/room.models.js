const db = require('../config/db');

exports.findAllPublic = async () =>{
  const result = await db.query('SELECT * FROM rooms WHERE is_public = true ORDER BY created_at DESC');
  return result.rows;
};
exports.create = async (roomData) =>{
  const {name, description, isPublic, maxParticipants, createdBy} = roomData;

  const result = await db.query(
    `
    INSERT INTO rooms (name, description, is_public, max_participants, created_by)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [name, description, isPublic, maxParticipants, createdBy]
  )
  return result.rows[0];
}
