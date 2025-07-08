// src/pages/AnalyticsPage.js
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, message } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const { Title } = Typography;
const COLORS = ['#FF4D4F', '#1890FF', '#FAAD14']; // error, info, warning

function AnalyticsPage() {
  const [eventCountByDay, setEventCountByDay] = useState([]);
  const [errorsOverTime, setErrorsOverTime] = useState([]);
  const [eventTypeDistribution, setEventTypeDistribution] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/analytics")
      .then((res) => {
        setEventCountByDay(res.data.eventCountByDay || []);
        setErrorsOverTime(res.data.errorsOverTime || []);
        setEventTypeDistribution(res.data.eventTypeDistribution || []);
      })
      .catch(() => message.error("Failed to load analytics data"));
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Analytics Overview</Title>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Event Count by Day">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventCountByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="error" fill="#FF4D4F" />
                <Bar dataKey="info" fill="#1890FF" />
                <Bar dataKey="warning" fill="#FAAD14" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Errors Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={errorsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="errors" stroke="#FF4D4F" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Event Type Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventTypeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {eventTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AnalyticsPage;
