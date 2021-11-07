import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Form, Select, Slider, Button, Table } from 'antd';
import axios from 'axios';
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

export default function FormContainer() {
  const [durationRange, setDurationRange] = useState({});
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios
      .get('https://damp-garden-93707.herokuapp.com/getdurationrange')
      .then(res => setDurationRange(res.data.data));
  }, []);
  const onFinish = values => {
    console.log('Received values of form: ', values);
    const formData = {
      info: {
        filter_agent_list: values.agentList,
        filter_time_range: values.range,
      },
    };
    axios({
      method: 'post',
      url: 'https://damp-garden-93707.herokuapp.com/getfilteredcalls',
      data: formData,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.data.data.map((agent, i) => ({ ...agent, key: i })))
      .then(finalData => setFilteredData(finalData));
  };

  const [agentList, setAgentList] = useState([]);

  useEffect(() => {
    axios
      .get('https://damp-garden-93707.herokuapp.com/getlistofagents')
      .then(response => setAgentList(response.data.data.listofagents));
  }, []);

  const getLabeledAgentData = agentList.length
    ? agentList.map(value => ({
        value,
        label: value,
      }))
    : [];

  const columns = [
    {
      title: 'Agent',
      dataIndex: 'agent_id',
    },
    {
      title: 'Call Id',
      dataIndex: 'call_id',
    },
    {
      title: 'Call Duration',
      dataIndex: 'call_time',
    },
  ];

  return (
    <div>
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={{
          range: [15, 50],
        }}
      >
        <Form.Item
          name="agentList"
          label="Agent Name"
          rules={[
            {
              required: true,
              message: 'Please select atleast one agent',
              type: 'array',
            },
          ]}
        >
          <Select mode="multiple">
            {/* {change the following snippet and add a loader component as well as handle 404 errors} */}
            {getLabeledAgentData.map(agent => (
              <Option key={agent.value} value={agent.value}>
                {agent.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="range" label="Call Duration">
          <Slider
            range={{ draggableTrack: true }}
            max={durationRange.maximum}
            min={durationRange.minimum}
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 10,
          }}
        >
          <Button type="primary" htmlType="submit" size="large">
            Search
          </Button>
        </Form.Item>
      </Form>
      {filteredData.length && (
        <Table
          columns={columns}
          dataSource={filteredData}
        />
      )}
    </div>
  );
}
