import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Public pages
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BlogList from "./pages/Blogs/BlogList";
import BlogDetails from "./pages/Blogs/BlogDetails";
import Footer from "./components/Footer";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import AuthorLayout from "./layouts/AuthorLayout";

// Admin pages
import Dashboard from "./pages/Admin/Dashboard";
import ManageBlogs from "./pages/Admin/ManageBlogs";
import Users from "./pages/Admin/Users";
import Comments from "./pages/Admin/Comments";

// Author pages
import AuthorDashboard from "./pages/Author/AuthorDashboard";
import Myblogs from "./pages/Author/Myblogs";

function AppContent() {
  const location = useLocation();

  // Hide footer on admin and author routes
  const hideFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/author");

  return (
    <>
      {/* Global Navbar (always visible) */}
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
      
        <Route
          path="/admin/manage-blogs"
          element={
            <AdminLayout>
              <ManageBlogs />
            </AdminLayout>
          }
        />

         <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <Users />
            </AdminLayout>
          }
        />

         <Route
          path="/admin/comments"
          element={
            <AdminLayout>
              <Comments />
            </AdminLayout>
          }
        />

        {/* Author routes */}
        <Route
          path="/author/authordashboard"
          element={
            <AuthorLayout>
              <AuthorDashboard />
            </AuthorLayout>
          }
        />
        
        
        <Route
          path="/author/myblogs"
          element={
            <AuthorLayout>
              <Myblogs />
            </AuthorLayout>
          }
        />
      </Routes>

      {/* Footer only on public pages */}
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
