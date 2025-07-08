import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Table,
  Typography,
  Popconfirm,
} from 'antd';
import axios from 'axios';

const { Title } = Typography;

function RulesPage() {
  const [rules, setRules] = useState([]);
  const [editingRule, setEditingRule] = useState(null);
  const [form] = Form.useForm();

  const fetchRules = () => {
    axios
      .get('http://localhost:8000/rules')
      .then((res) => setRules(res.data))
      .catch(() => message.error('Failed to load rules'));
  };

  useEffect(() => {
    fetchRules();
  }, []);

const onFinish = (values) => {
  if (editingRule) {
    axios
      .put(`http://localhost:8000/rules/${editingRule.id}`, values)
      .then(() => {
        message.success("Rule updated");
        setEditingRule(null);
        form.resetFields();
        fetchRules();
      })
      .catch(() => message.error("Failed to update rule"));
  } else {
    axios
      .post("http://localhost:8000/rules", values)
      .then(() => {
        message.success("Rule created");
        form.resetFields();
        fetchRules();
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.detail === "Rule already exists"
        ) {
          message.warning("⚠️ This rule already exists!");
        } else {
          message.error("Failed to create rule");
        }
      });
  }
};


  const handleEdit = (rule) => {
    setEditingRule(rule);
    form.setFieldsValue(rule);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/rules/${id}`)
      .then(() => {
        message.success('Rule deleted');
        fetchRules();
      })
      .catch(() => message.error('Failed to delete rule'));
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'User ID', dataIndex: 'user_id' },
    { title: 'Event Type', dataIndex: 'event_type' },
    { title: 'Threshold', dataIndex: 'threshold' },
    { title: 'Time Window (min)', dataIndex: 'time_window_minutes' },
    { title: 'Message', dataIndex: 'message' },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Button
            size="small"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Confirm delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>{editingRule ? 'Edit Rule' : 'Add New Rule'}</Title>

      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        style={{ marginBottom: 24 }}
        key={editingRule ? editingRule.id : 'new'}
      >
        <Form.Item name="user_id">
          <Input placeholder="User ID (optional)" />
        </Form.Item>
        <Form.Item name="event_type" rules={[{ required: true }]}>
          <Select placeholder="Event Type" style={{ width: 120 }}>
            <Select.Option value="error">error</Select.Option>
            <Select.Option value="info">info</Select.Option>
            <Select.Option value="warning">warning</Select.Option>
            <Select.Option value="LOGIN">LOGIN</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="threshold" rules={[{ required: true }]}>
          <InputNumber placeholder="Threshold" />
        </Form.Item>
        <Form.Item name="time_window_minutes" rules={[{ required: true }]}>
          <InputNumber placeholder="Window (min)" />
        </Form.Item>
        <Form.Item name="message" rules={[{ required: true }]}>
          <Input placeholder="Slack Message" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editingRule ? 'Update' : 'Add'} Rule
          </Button>
        </Form.Item>
        {editingRule && (
          <Form.Item>
            <Button onClick={() => {
              setEditingRule(null);
              form.resetFields();
            }}>
              Cancel
            </Button>
          </Form.Item>
        )}
      </Form>

      <Table dataSource={rules} columns={columns} rowKey="id" />
    </div>
  );
}

export default RulesPage;
