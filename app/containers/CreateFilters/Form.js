import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Form, Slider, Table } from 'antd';
import LoadingIndicator from 'components/LoadingIndicator';
import axiosHelper from '../../utils/axios';
import MultiSelectInput from '../../components/CustomComponents/MultiSelectInput';
import FormButton from '../../components/CustomComponents/Button';
import { getCallRange, getAgentList, filterCalls } from '../../utils/constants';
import FailureComponent from '../../components/CustomComponents/Failure';

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

export default function FormContainer() {
  const [durationRange, setDurationRange] = useState({});
  const [filteredData, setFilteredData] = useState(null);
  const [agentList, setAgentList] = useState([]);
  const [isLoadingVisible, setIsLoadingVisible] = useState(false);
  const [isFailureComponentVisible, setIsFailureComponentVisible] = useState(
    false
  );

  useEffect(() => {
    axiosHelper('get', getCallRange)
      .then(res => setDurationRange(res.data.data))
      .catch(() => setIsFailureComponentVisible(true));

    axiosHelper('get', getAgentList)
      .then(response => setAgentList(response.data.data.listofagents))
      .catch(() => setIsFailureComponentVisible(true));
  }, [isFailureComponentVisible]);

  const onFinish = values => {
    setIsLoadingVisible(true);
    // console.log('Received values of form: ', values);
    const formData = {
      info: {
        filter_agent_list: values.agentList,
        filter_time_range: values.range,
      },
    };
    axiosHelper('post', filterCalls, formData)
      .then(res => res.data.data.map((agent, i) => ({ ...agent, key: i })))
      .then(finalData => setFilteredData(finalData))
      .catch(() => setIsFailureComponentVisible(true));
  };

  const getLabeledAgentData = agentList.length
    ? agentList.map((value, i) => ({
        key: i,
        label: value,
      }))
    : [];

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
        <MultiSelectInput
          key={agentList}
          name="agentList"
          label="Agent Name"
          tag="agent"
          isRequired
          data={getLabeledAgentData}
        />

        <Form.Item name="range" label="Call Duration">
          <Slider
            range={{ draggableTrack: true }}
            max={durationRange.maximum}
            min={durationRange.minimum}
          />
        </Form.Item>
        <FormButton name="Search" />
      </Form>
      {isFailureComponentVisible ? (
        <FailureComponent onClick={() => setIsFailureComponentVisible(false)} />
      ) : isLoadingVisible ? (
        !filteredData ? (
          <LoadingIndicator />
        ) : (
          <Table columns={columns} dataSource={filteredData} />
        )
      ) : (
        ''
      )}
    </div>
  );
}
