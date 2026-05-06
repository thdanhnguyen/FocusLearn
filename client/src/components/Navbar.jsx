import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">🕰️ Co-Work Timer</Link>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
          <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Register</Link>
        </div>
      </div>
    </nav>
  );
}
