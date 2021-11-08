import React from 'react';
import 'antd/dist/antd.css';
import { Result, Button } from 'antd';

export default function FailureComponent(props) {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something wrong while fetching the page!"
      extra={<Button onClick={props.onClick} type="primary">Retry</Button>}
    />
  );
}
