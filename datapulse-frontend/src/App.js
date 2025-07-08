// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import SidebarMenu from './components/SidebarMenu';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import RulesPage from './pages/RulesPage';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import './components/ChatWidget.css';
import 'antd/dist/reset.css';

const { Sider, Content } = Layout;

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function MainLayout({ collapsed, setCollapsed }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/home', { replace: true });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          onClick={handleLogoClick}
          style={{
            height: 5,
            margin: 30,
            color: '#fff',
            fontSize: 24,
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          {collapsed ? 'DP' : 'DataPulse'}
        </div>
        <SidebarMenu />
      </Sider>
      <Layout>
        <Content style={{ margin: '16px' }}>
          <Routes>
            <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/alerts" element={<PrivateRoute><AlertsPage /></PrivateRoute>} />
            <Route path="/rules" element={<PrivateRoute><RulesPage /></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Content>
        <ChatWidget />
      </Layout>
    </Layout>
  );
}

function AppWrapper() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <MainLayout collapsed={collapsed} setCollapsed={setCollapsed} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
