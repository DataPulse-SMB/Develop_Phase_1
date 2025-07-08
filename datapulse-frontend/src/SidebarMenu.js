import React from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  BellOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  ToolOutlined, // ← new icon import
} from '@ant-design/icons';
//import { useNavigate } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';


function SidebarMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Menu
      theme="dark"
      mode="inline"
      //defaultSelectedKeys={['/dashboard']}
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      items={[
        { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/alerts', icon: <BellOutlined />, label: 'Alerts' },
        { key: '/analytics', icon: <BarChartOutlined />, label: 'Analytics' },
        { key: '/rules', label: 'Rules' },
        { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
        { key: '/profile', icon: <UserOutlined />, label: 'Profile' },
      ]}
    />
  );
}

export default SidebarMenu;
