// src/pages/AlertsPage.js
import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, Alert, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/alerts')
      .then((res) => {
        setAlerts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load alerts');
        message.error('Failed to load alerts');
        setLoading(false);
      });
  };

  const alertColumns = [
    { title: 'Alert ID', dataIndex: 'id', key: 'id' },
    { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Message', dataIndex: 'message', key: 'message' },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Triggered Alerts</Title>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <Table
          columns={alertColumns}
          dataSource={alerts}
          rowKey="id"
          bordered
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default AlertsPage;
