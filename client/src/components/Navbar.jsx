import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth(); // Lấy thông tin user hiện tại từ Đám mây
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Xóa thẻ Token
    navigate('/login'); // Đá văng ra trang đăng nhập
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">FocusLearn</Link>
        <div className="space-x-4 flex items-center">
          
          {/* KIẾN THỨC MỚI (Conditional Rendering):
              Nếu user có tồn tại (Tức là đã đăng nhập), thì render khối Giao diện Avatar + Đăng xuất.
              Nếu user bằng null (Chưa đăng nhập), thì render nút Đăng Nhập + Đăng Ký. 
          */}
          
          {user ? (
            <>
              <span className="text-gray-600 font-medium">👋 Chào, {user.display || user.displayName}</span>
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-medium px-3 py-1 border border-red-100 rounded-md bg-red-50"
              >
                Đăng Xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Đăng Nhập</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">Đăng Ký</Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}
