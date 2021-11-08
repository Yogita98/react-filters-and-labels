import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Table, Tag, Alert } from 'antd';
import LoadingIndicator from 'components/LoadingIndicator';
import MultiSelectInput from '../../components/CustomComponents/MultiSelectInput';
import FormButton from '../../components/CustomComponents/Button';
import axiosHelper from '../../utils/axios';
import { getCallList, getLabelList, applyLabels } from '../../utils/constants';
import './form.css';
import CenteredSection from '../HomePage/CenteredSection';
import FailureComponent from '../../components/CustomComponents/Failure';
/*
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
    key: 'label',
    dataIndex: 'label',
    render: label => (
      <>
        {label.map(tag => (
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
  const [isAlertMessageVisible, setIsAlertMessageVisible] = useState(false);
  const [isFailureComponentVisible, setIsFailureComponentVisible] = useState(
    false,
  );

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: record => ({
      id: record.agent_id,
    }),
  };

  useEffect(() => {
    axiosHelper('get', getCallList)
      .then(res =>
        res.data.data.call_data.map((call, i) => ({
          call_id: call.call_id,
          label: call.label_id,
          key: i,
        })),
      )
      .then(finalData => setCallList(finalData))
      .catch(error => setIsFailureComponentVisible(true));

    axiosHelper('get', getLabelList)
      .then(res =>
        res.data.data.unique_label_list.map((label, i) => ({
          label,
          key: i,
        })),
      )
      .then(finalData => {
        setLabelList(finalData);
      })
      .catch(error => setIsFailureComponentVisible(true));
  });

  const prepareFormData = (action, data) =>
    action === 'create'
      ? [
          {
            name: data,
            op: 'add',
          },
        ]
      : data
      ? data.map(item => ({
          name: item,
          op: action,
        }))
      : [];

  const onFinish = actions => {
    console.log('Received values of form: ', actions);
    // Show a alert message if no input found in any of the fields
    if (Object.values(actions).every(el => el === undefined)) {
      setIsAlertMessageVisible(true);
    }
    // Prepare formData for each action to send with the request
    const actionsArray = [];
    for (const action in actions) {
      actionsArray.push(...prepareFormData(action, actions[action]));
    }
    const formData = {
      operation: {
        callList: selectedRows.map(row => row.call_id),
        label_ops: actionsArray,
      },
    };
    axiosHelper('post', applyLabels, formData)
      .then(res => console.log('success'))
      .catch(error => setIsFailureComponentVisible(true));
  };
  return (
    <div>
      {isAlertMessageVisible && (
        <CenteredSection>
          <Alert
            className="alertContainer"
            message="Error"
            type="error"
            description="Enter labels in atleast one of the fields to perform this action!"
            closable
            afterClose={() => setIsAlertMessageVisible(false)}
          />
        </CenteredSection>
      )}
      <Form name="validate_other" {...formItemLayout} onFinish={onFinish}>
        <MultiSelectInput
          key={labelList}
          name="add"
          label="Add a new label"
          tag="label"
          data={labelList}
        />

        <MultiSelectInput
          name="remove"
          label="Remove label from agents"
          data={labelList}
        />

        <Form.Item
          name="create"
          label="Create a new label"
          rules={[
            {
              message: 'Please select atleast one label',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <FormButton name="Go!" />
      </Form>
      {isFailureComponentVisible ? (
        <FailureComponent onClick={() => setIsFailureComponentVisible(false)} />
      ) : !callList.length ? (
        <LoadingIndicator />
      ) : (
        <Table
          rowSelection={{
            ...rowSelection,
          }}
          columns={columns}
          dataSource={callList}
        />
      )}
    </div>
  );
}
