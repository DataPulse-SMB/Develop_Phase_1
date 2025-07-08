// ✅ 1. Create EventDetailsModal.js inside src/components

import React from 'react';
import { Modal, Descriptions } from 'antd';

const EventDetailsModal = ({ visible, onClose, event }) => {
  if (!event) return null;

  return (
    <Modal
      title={`Event #${event.id}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Event ID">{event.id}</Descriptions.Item>
        <Descriptions.Item label="User ID">{event.user_id}</Descriptions.Item>
        <Descriptions.Item label="Type">{event.event_type}</Descriptions.Item>
        <Descriptions.Item label="Created At (ISO)">
          {new Date(event.created_at).toISOString()}
        </Descriptions.Item>
        <Descriptions.Item label="Payload JSON">
          <pre>{JSON.stringify(event.payload, null, 2)}</pre>
        </Descriptions.Item>
        {/* Optional fields */}
        <Descriptions.Item label="User Agent">
          {event.payload?.user_agent || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="IP Address">
          {event.payload?.ip || 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default EventDetailsModal;
