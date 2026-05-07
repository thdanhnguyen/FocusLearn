import { createContext, useContext, useState, useEffect } from 'react';

// KIẾN THỨC MỚI (Context API): 
// Bình thường ở React, muốn truyền dữ liệu từ Component Cha xuống Con phải dùng "props" (truyền từng tầng rất mệt).
// Context giống như một "Đám mây dữ liệu" (Global State). Bất kỳ Component nào ở bất kỳ đâu cũng có thể thọc tay lên đám mây này lấy dữ liệu xuống.
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Không cần useEffect nữa vì đã init đồng bộ ở trên


  // Hàm gọi khi đăng nhập thành công
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token); // Lưu token (Thẻ thông hành) vào túi quần (localStorage) để lát dùng gọi API
  };

  // Hàm gọi khi đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh để các component khác xài cho lẹ
export const useAuth = () => useContext(AuthContext);
