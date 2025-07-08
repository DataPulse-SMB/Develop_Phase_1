import React, { useEffect, useState } from 'react';
import {
  Layout,
  Menu,
  Typography,
  Table,
  Spin,
  Alert,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Tag,
  message
} from 'antd';
import {
  DashboardOutlined,
  BellOutlined,
  SettingOutlined,
  BarChartOutlined,
  UserOutlined
} from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/reset.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = () => {
    setLoading(true);
    axios.get("http://127.0.0.1:8000/events", {
      params: { ...filters, skip: 0, limit: 50 },
    })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        message.error("Failed to load events");
        setError("Failed to load events");
        setLoading(false);
      });
  };

  const fetchAlerts = () => {
    axios.get("http://127.0.0.1:8000/alerts")
      .then((res) => setAlerts(res.data))
      .catch(() => message.error("Failed to load alerts"));
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

  const columns = [
    { title: 'Event ID', dataIndex: 'id', key: 'id' },
    { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
    {
      title: 'Type',
      dataIndex: 'event_type',
      key: 'event_type',
      render: (type) => (
        <Tag color={type === "error" ? "red" : type === "info" ? "blue" : "orange"}>
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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(val) => setCollapsed(val)}>
        <div style={{ color: 'white', padding: 20, fontWeight: 'bold', fontSize: 18 }}>
          DPulse
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
          <Menu.Item key="2" icon={<BellOutlined />}>Alerts</Menu.Item>
          <Menu.Item key="3" icon={<BarChartOutlined />}>Analytics</Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>Settings</Menu.Item>
          <Menu.Item key="5" icon={<UserOutlined />}>Profile</Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', paddingLeft: 20 }}>
          <Title level={3}>DataPulse Dashboard</Title>
        </Header>

        <Content style={{ margin: '16px' }}>
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col>
              <Select
                placeholder="Event Type"
                onChange={(value) => setFilters({ ...filters, event_type: value })}
                allowClear
                options={[
                  { value: "error", label: "Error" },
                  { value: "info", label: "Info" },
                  { value: "warning", label: "Warning" },
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
              <Button type="primary" onClick={fetchEvents}>Search</Button>
            </Col>
          </Row>

          <Title level={4}>Recent Events</Title>
          {loading ? (
            <Spin size="large" />
          ) : error ? (
            <Alert message={error} type="error" />
          ) : (
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              bordered
              pagination={{ pageSize: 10 }}
            />
          )}

          <Title level={4} style={{ marginTop: 40 }}>Recent Alerts</Title>
          <Table
            columns={alertColumns}
            dataSource={alerts}
            rowKey="id"
            bordered
            pagination={{ pageSize: 5 }}
          />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
