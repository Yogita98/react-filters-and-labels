import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Form, Select, Slider, Button, Divider, Table } from 'antd';
const { Option } = Select;
import axios from 'axios';

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
    }).then(res => {
      return res.data.data.map((agent,i) => {return {...agent, key:i}});
      
    }).then(finalData => setFilteredData(finalData));
  };

  const [agentList, setAgentList] = useState([]);

  useEffect(() => {
    axios
      .get('https://damp-garden-93707.herokuapp.com/getlistofagents')
      .then(response => setAgentList(response.data.data.listofagents));
  }, []);

  const getLabeledAgentData = () => {
    return agentList.length
      ? agentList.map(value => ({
          value,
          label: value,
        }))
      : [];
  };

  const columns = [
    {
      title: 'Agent',
      dataIndex: 'agent_id',
      // render: (text) => <a>{text}</a>,
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

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

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
            {getLabeledAgentData().map(agent => {
              return <Option key={agent.value} value={agent.value}>{agent.label}</Option>;
            })}
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
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
      {/* <Divider /> */}
      {filteredData.length && (
        <Table
          // rowSelection={{
          //   type: selectionType,
          //   ...rowSelection,
          // }}
          columns={columns}
          dataSource={filteredData}
        />
      )}
    </div>
  );
}
