import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; 
import AdminLayout from "./pages/Admin/AdminLayout";
import PendingAuthors from "./pages/Admin/PendingAuthors";
import AdminRoute from "./routes/AdminRoute";
import ManageBlogs from "./pages/Admin/ManageBlogs";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/admin/pending-authors" element={<PendingAuthors />} />
        <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>} />
        <Route path="/admin/manage-blogs" element={<ManageBlogs />} />
        

      </Routes>
    </Router>
  );
}

export default App;
