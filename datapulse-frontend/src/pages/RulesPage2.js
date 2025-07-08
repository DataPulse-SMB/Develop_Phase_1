// src/pages/RulesPage.js

import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

function RulesPage() {
  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>Alert Rule Builder</Title>
      <p>This is the Rules page. You can define custom alert rules here.</p>
    </div>
  );
}

export default RulesPage;
