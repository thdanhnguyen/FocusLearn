import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-extrabold text-indigo-600 mb-6">Welcome to Co-Work Timer</h1>
      <p className="text-xl text-gray-600 mb-8">Boost your productivity by focusing together with others.</p>
      <Link to="/login" className="bg-indigo-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-indigo-700 text-lg">
        Get Started
      </Link>
    </div>
  );
}
