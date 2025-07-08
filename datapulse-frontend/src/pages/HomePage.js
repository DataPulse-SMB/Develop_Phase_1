// src/pages/HomePage.js
import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  BarChartOutlined,
  BellOutlined,
  LineChartOutlined,
  ToolOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const features = [
  { title: 'Dashboard', icon: <BarChartOutlined style={{ fontSize: 30 }} />, route: '/dashboard' },
  { title: 'Alerts', icon: <BellOutlined style={{ fontSize: 30 }} />, route: '/alerts' },
  { title: 'Analytics', icon: <LineChartOutlined style={{ fontSize: 30 }} />, route: '/analytics' },
  { title: 'Rules', icon: <ToolOutlined style={{ fontSize: 30 }} />, route: '/rules' },
  { title: 'Settings', icon: <SettingOutlined style={{ fontSize: 30 }} />, route: '/settings' },
  { title: 'Profile', icon: <UserOutlined style={{ fontSize: 30 }} />, route: '/profile' }
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Welcome to DataPulse</Title>
      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        {features.map((feature) => (
          <Col xs={24} sm={12} md={8} lg={6} key={feature.title}>
            <Card
              hoverable
              onClick={() => navigate(feature.route)}
              style={{ textAlign: 'center', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              <div>{feature.icon}</div>
              <Title level={4} style={{ marginTop: 12 }}>{feature.title}</Title>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;
