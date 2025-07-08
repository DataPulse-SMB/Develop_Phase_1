// src/pages/SettingsPage.js
import React, { useEffect, useState } from 'react';
import { Typography, Form, Input, Button, Switch, Divider, message, Card } from 'antd';
import axios from 'axios';

const { Title } = Typography;

function SettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Load settings from backend
  const fetchSettings = () => {
    setLoading(true);
    axios.get('http://localhost:8000/settings')
      .then(res => {
        form.setFieldsValue(res.data);
      })
      .catch(() => message.error("Failed to load settings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = (values) => {
    axios.post('http://localhost:8000/settings', values)
      .then(() => message.success("Settings saved"))
      .catch(() => message.error("Failed to save settings"));
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Application Settings</Title>

      <Card loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{ notifications: true }}
        >
          <Form.Item
            label="Slack Webhook URL"
            name="slack"
            rules={[{ type: 'url', message: 'Enter a valid URL' }]}
          >
            <Input placeholder="https://hooks.slack.com/..." />
          </Form.Item>

          <Form.Item
            label="Admin Email for Alerts"
            name="email"
            rules={[{ type: 'email', message: 'Enter a valid email' }]}
          >
            <Input placeholder="admin@datapulse.com" />
          </Form.Item>

          <Form.Item
            label="Enable Real-Time Notifications"
            name="notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Divider />

          <Button type="primary" htmlType="submit">Save Settings</Button>
        </Form>
      </Card>
    </div>
  );
}

export default SettingsPage;
