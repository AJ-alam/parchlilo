import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

import './styles/Global.css';

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Standard Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog-post" element={<BlogPost />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Legacy HTML Path Maps */}
            <Route path="/index.html" element={<Home />} />
            <Route path="/blogs.html" element={<Blogs />} />
            <Route path="/blog-post.html" element={<BlogPost />} />
            <Route path="/admin.html" element={<Admin />} />
            <Route path="/contact.html" element={<Contact />} />
            <Route path="/privacy.html" element={<Privacy />} />
            <Route path="/terms.html" element={<Terms />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
