import React from 'react';
import { Form, Button } from 'antd';

export default function FormButton({ name }) {
  return (
    <Form.Item
      wrapperCol={{
        span: 12,
        offset: 10,
      }}
    >
      <Button type="primary" htmlType="submit" size="large">
        {name}
      </Button>
    </Form.Item>
  );
}
