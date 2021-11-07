import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Form, Select, Input, Button, Table, Tag, Alert } from 'antd';
import axios from 'axios';
const { Option } = Select;
import LoadingIndicator from 'components/LoadingIndicator';

/*
TODO: component reuse
loader component
404 errors maybe?
*/

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const columns = [
  {
    title: 'Call Id',
    dataIndex: 'call_id',
    sorter: (a, b) => a.call_id - b.call_id,
    sortDirections: ['descend'],
  },
  {
    title: 'Labels',
    key: 'label_id',
    dataIndex: 'label_id',
    render: label_id => (
      <>
        {label_id.map(tag => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </>
    ),
  },
];

export default function FormContainer() {
  const [callList, setCallList] = useState([]);
  const [labelList, setLabelList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLabelListChanged, setIsLabelListChanged] = useState(false);
  const [isAlertMessageVisible, setIsAlertMessageVisible] = useState(false)

  useEffect(() => {
    axios({
      method: 'get',
      url: 'https://damp-garden-93707.herokuapp.com/getcalllist',
      headers: {
        user_id: '24b456',
      },
    })
      .then(res =>
        res.data.data.call_data.map((call, i) => ({ ...call, key: i }))
      )
      .then(finalData => setCallList(finalData));

    axios({
      method: 'get',
      url: 'https://damp-garden-93707.herokuapp.com/getlistoflabels',
      headers: {
        user_id: '24b456',
      },
    })
      .then(res =>
        res.data.data.unique_label_list.map((call, i) => ({
          label_id: call,
          key: i,
        }))
      )
      .then(finalData => {
        setLabelList(finalData);
      });
    return function cleanUp() {
      setIsLabelListChanged(false);
    };
  },[isLabelListChanged]);

  const prepareFormData = (action, data) => {
    return action === 'create'
      ? [
          {
            name: data,
            op: action,
          },
        ]
      : data
      ? data.map(item => {
          return {
            name: item,
            op: action,
          };
        })
      : [];
  };

  const onFinish = actions => {
    console.log('Received values of form: ', actions);
    const mergedArray = [];
    if(Object.values(actions).every(el => el === undefined)){
      setIsAlertMessageVisible(true)
    }
    for (const action in actions) {
      mergedArray.push(...prepareFormData(action, actions[action]));
    }
    console.log(mergedArray);
    const formData = {
      operation: {
        callList: selectedRows.map(row => row.call_id),
        label_ops: mergedArray,
      },
    };
    axios({
      method: 'post',
      url: 'https://damp-garden-93707.herokuapp.com/applyLabels',
      data: formData,
      headers: {
        'Content-Type': 'application/json',
        user_id: '24b456',
      },
    }).then(res => setIsLabelListChanged(true));
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: record => ({
      id: record.agent_id,
    }),
  };
  return (
    <div>
      {!callList && <LoadingIndicator />}
      {isAlertMessageVisible && <Alert style={{marginBottom:"20px", marginTop:"16px"}}
      message="Error"
      type="error"
      showIcon
      description="Enter labels in atleast one of the fields to perform this action!"
      closable
      afterClose = {()=> setIsAlertMessageVisible(false)}
    />}
      <Form name="validate_other" {...formItemLayout} onFinish={onFinish}>
        <Form.Item
          name="add"
          label="Add a new label"
          rules={[
            {
              message: 'Please select atleast one label',
              type: 'array',
            },
          ]}
        >
          <Select mode="multiple">
            {labelList.map(label => {
              return (
                <Option key={label.key} value={label.label_id}>
                  {label.label_id}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="remove"
          label="Remove label from agents"
          rules={[
            {
              message: 'Please select atleast one label',
              type: 'array',
            },
          ]}
        >
          <Select mode="multiple" onChange={(val) => console.log(val)}>
            {labelList.map(label => {
              return (
                <Option key={label.key} value={label.label_id}>
                  {label.label_id}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="create"
          label="Create a new label"
          rules={[
            {
              message: 'Please select atleast one label',
            },
          ]}
        >
          <Input onChange={(val) => console.log(val)} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 10,
          }}
        >
          <Button type="primary" htmlType="submit" size="large">
            Go!
          </Button>
        </Form.Item>
      </Form>

      <Table
        rowSelection={{
          ...rowSelection,
        }}
        columns={columns}
        dataSource={callList}
      />
    </div>
  );
}
