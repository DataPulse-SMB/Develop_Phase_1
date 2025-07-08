// src/pages/ProfilePage.js
import React from 'react';
import { Typography, Descriptions, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

function ProfilePage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Profile</Title>

      <div style={{ marginBottom: 20 }}>
        <Avatar size={64} icon={<UserOutlined />} />
      </div>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Username">admin_user</Descriptions.Item>
        <Descriptions.Item label="Email">admin@datapulse.dev</Descriptions.Item>
        <Descriptions.Item label="Role">Administrator</Descriptions.Item>
        <Descriptions.Item label="Joined">2025-06-15</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default ProfilePage;
