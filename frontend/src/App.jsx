import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ManageProjects from './pages/ManageProjects';
import ManageExperiences from './pages/ManageExperiences';
import ManageCertifications from './pages/ManageCertifications';
import ManagePosts from './pages/ManagePosts';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/projects" 
          element={
          <ProtectedRoute>
            <ManageProjects />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/admin/experiences" 
          element={<ProtectedRoute>
            <ManageExperiences />
            </ProtectedRoute>
          } 
        />
         <Route 
         path="/admin/certifications" 
         element={<ProtectedRoute>
          <ManageCertifications />
          </ProtectedRoute>
          } 
        />
         <Route 
         path="/admin/posts" 
         element={<ProtectedRoute>
          <ManagePosts />
          </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}