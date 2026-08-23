import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ManageProjects from './pages/ManageProjects';
import ManageExperiences from './pages/ManageExperiences';
import ManageCertifications from './pages/ManageCertifications';
import ManageArticles from './pages/ManageArticles';
import ManageBooks from './pages/ManageBooks';
import ManagePoetry from './pages/ManagePoetry';

import Articles from './pages/Articles';
import Books from './pages/Books';
import Poetry from './pages/Poetry';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & Content Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/books" element={<Books />} />
        <Route path="/poetry" element={<Poetry />} />
        
        {/* Auth Route */}
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
          element={
            <ProtectedRoute>
              <ManageExperiences />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/certifications" 
          element={
            <ProtectedRoute>
              <ManageCertifications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/articles" 
          element={
            <ProtectedRoute>
              <ManageArticles />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/books" 
          element={
            <ProtectedRoute>
              <ManageBooks />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/poetry" 
          element={
            <ProtectedRoute>
              <ManagePoetry />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}