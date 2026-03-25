import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import SpinPage from './pages/SpinPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import RequestsPage from './pages/RequestsPage';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout() {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  const noNavPages = ['/', '/login', '/register'];
  const showNav = !noNavPages.includes(location.pathname) && localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-dark-950">
      {showNav && <Navbar pendingCount={pendingCount} />}
      <main className={showNav ? 'pt-16 pb-20 md:pb-0' : ''}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/feed" element={
            <ProtectedRoute>
              <FeedPage onPendingCount={setPendingCount} />
            </ProtectedRoute>
          } />
          <Route path="/spin" element={
            <ProtectedRoute><SpinPage /></ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute><SearchPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/requests" element={
            <ProtectedRoute>
              <RequestsPage onPendingCount={setPendingCount} />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
