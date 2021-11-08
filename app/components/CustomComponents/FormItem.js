import React from 'react';
import { Form } from 'antd';

export default function FormInput({ name, label, rules, children }) {
  return (
    <Form.Item name={name} label={label} rules={rules}>
      {children}
    </Form.Item>
  );
}
