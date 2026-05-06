const RoomModel = require('../models/room.models');
const {success, error} = require('../utils/response');

exports.getAllRooms = async (req, res) =>{
  try{
    const rooms = await RoomModel.findAllPublic();
    return success(res, rooms, "Lấy danh sách phòng thành công", 200);

  } catch (err){
    return error(res, "Lỗi máy chủ", 500);
  }
  
};
exports.createRoom = async (req, res) =>{
  try{
    const {name, description, isPublic, maxParticipants} = req.body;
    if(!name){
      return error(res, "Bạn cần nhập tên phòng", 400);
    }
    
    const createdBy = req.user.id;
    const newRoom = await RoomModel.create({
      name,
      description: description || '',
      isPublic: isPublic !== undefined ? isPublic: true,
      maxParticipants: maxParticipants || 10,
      createdBy,
    });
    return success(res, newRoom, "Tạo phòng học thành công", 200);
  } catch (err){
    return error(res, "Có lỗi xảy ra", 500);
  }
}