import { Link } from 'react-router-dom';

export default function RoomList({ rooms = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map(room => (
        <div key={room.id} className="bg-white shadow p-6 rounded-lg border">
          <h3 className="text-xl font-bold mb-2">{room.name}</h3>
          <p className="text-gray-600 mb-4">{room.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{room.max_participants} max</span>
            <Link to={`/room/${room.id}`} className="text-indigo-600 font-semibold hover:underline">Join Room</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
