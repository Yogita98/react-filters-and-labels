import React from 'react';
import { Select } from 'antd';
import FormInput from './FormItem';
const { Option } = Select;

export default function MultiSelectInput({
  name,
  label,
  tag,
  isRequired,
  data,
}) {
  return (
    <FormInput
      name={name}
      label={label}
      rules={[
        {
          required: isRequired || false,
          message: `Please select atleast one ${tag}`,
          type: 'array',
        },
      ]}
    >
      <Select mode="multiple">
        {data.map(el => (
          <Option key={el.key} value={el.label}>
            {el.label}
          </Option>
        ))}
      </Select>
    </FormInput>
  );
}
