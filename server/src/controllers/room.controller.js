exports.getAllRooms = async (req, res) => {
  res.status(200).json({ message: "Get all public rooms" });
};

exports.createRoom = async (req, res) => {
  res.status(200).json({ message: "Create room endpoint" });
};
