import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import DashboardPage from './pages/DashboardPage';
import BlogPost from './pages/post';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';
import UpdatePostPage from './pages/update';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/update/:id" element={<UpdatePostPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/post/:id" element={<BlogPost />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;