import React, { useEffect, useState } from 'react';
import {
  Table,
  Layout,
  Typography,
  Spin,
  Alert,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Tag,
  message,
  Space
} from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EventDetailsModal from '../components/EventDetailsModal';
import { exportToCSV } from '../pages/exportCSV'; // ✅ NEW

const { Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchEvents = () => {
    setLoading(true);
    const params = {
      ...filters,
      skip: 0,
      limit: 50,
    };

    axios
      .get('http://127.0.0.1:8000/events', { params })
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load events');
        message.error('Failed to load events');
        setLoading(false);
      });
  };

  const fetchAlerts = () => {
    axios
      .get('http://127.0.0.1:8000/alerts')
      .then((res) => {
        const recent = res.data.slice(0, 3);
        setAlerts(recent);
      })
      .catch(() => message.error('Failed to load alerts'));
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRowClick = (record) => {
    setSelectedEvent(record);
    setIsModalVisible(true);
  };

  const eventColumns = [
    { title: 'Event ID', dataIndex: 'id', key: 'id' },
    { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
    {
      title: 'Type',
      dataIndex: 'event_type',
      key: 'event_type',
      render: (type) => (
        <Tag color={type === 'error' ? 'red' : type === 'info' ? 'blue' : 'orange'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Message',
      key: 'message',
      render: (_, record) => record.payload?.message || '',
    },
    {
      title: 'Code',
      key: 'code',
      render: (_, record) => record.payload?.code || '',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

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
    <Content style={{ padding: '24px' }}>
      <Title level={3}>Dashboard</Title>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col>
          <Select
            placeholder="Event Type"
            onChange={(value) => setFilters({ ...filters, event_type: value })}
            allowClear
            options={[
              { value: 'error', label: 'Error' },
              { value: 'info', label: 'Info' },
              { value: 'warning', label: 'Warning' },
            ]}
          />
        </Col>
        <Col>
          <Input
            placeholder="User ID"
            onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
          />
        </Col>
        <Col>
          <RangePicker
            onChange={(dates) =>
              setFilters({
                ...filters,
                start_date: dates?.[0]?.toISOString(),
                end_date: dates?.[1]?.toISOString(),
              })
            }
          />
        </Col>
        <Col>
          <Button type="primary" onClick={fetchEvents}>
            Search
          </Button>
        </Col>
      </Row>

      {/* ✅ CSV EXPORT BUTTONS */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Button onClick={() => exportToCSV(
            'events.csv',
            ['id', 'user_id', 'event_type', 'message', 'code', 'created_at'],
            events.map(event => ({
              ...event,
              message: event.payload?.message || '',
              code: event.payload?.code || '',
            }))
          )}>
            Export Events CSV
          </Button>
        </Col>

        <Col>
          <Button onClick={() => exportToCSV(
            'alerts.csv',
            ['id', 'user_id', 'message', 'created_at'],
            alerts
          )}>
            Export Alerts CSV
          </Button>
        </Col>
      </Row>

      <Title level={4}>Recent Events</Title>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <Table
          columns={eventColumns}
          dataSource={events}
          rowKey="id"
          bordered
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      )}

      <Space style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={4}>Recent Alerts (Top 3)</Title>
        <Link to="/alerts">View All Alerts →</Link>
      </Space>
      <Table
        columns={alertColumns}
        dataSource={alerts}
        rowKey="id"
        bordered
        pagination={false}
      />

      <EventDetailsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        event={selectedEvent}
      />
    </Content>
  );
}

export default DashboardPage;
