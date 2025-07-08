// components/SidebarMenu.js
import { Menu } from 'antd';
import {
  DashboardOutlined, BellOutlined, BarChartOutlined, ToolOutlined,
  SettingOutlined, UserOutlined, LogoutOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const SidebarMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });  
    window.location.reload();               
  };

  return (
    <Menu theme="dark" mode="inline">
      <Menu.Item key="dashboard" icon={<DashboardOutlined />} onClick={() => navigate('/dashboard')}>
        Dashboard
      </Menu.Item>
      <Menu.Item key="alerts" icon={<BellOutlined />} onClick={() => navigate('/alerts')}>
        Alerts
      </Menu.Item>
      <Menu.Item key="analytics" icon={<BarChartOutlined />} onClick={() => navigate('/analytics')}>
        Analytics
      </Menu.Item>
      <Menu.Item key="rules" icon={<ToolOutlined />} onClick={() => navigate('/rules')}>
        Rules
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate('/settings')}>
        Settings
      </Menu.Item>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/profile')}>
        Profile
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        style={{ marginTop: 'auto', color: 'red' }}
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>
    </Menu>
  );
};

export default SidebarMenu;
