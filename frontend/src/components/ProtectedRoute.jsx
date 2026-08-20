import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Check if the VIP pass exists in local storage
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    // No token? Kick them back to the login page
    return <Navigate to="/login" replace />;
  }
  
  // Has token? Let them see the dashboard!
  return children;
}