// import React from 'react';
// import Select from 'react-select';
import React, { useEffect, useState } from 'react';
// import ReactDOM from 'react-dom';
import axios from 'axios';
import { Form, Input, Button, Checkbox, Select } from 'antd';
const { Option } = Select;


export default function MultiSelectInput() {
  
  const [agentList, setAgentList] = useState([]);
  const [selectedOption, setSelectedOption] = useState([
    // { value: 'Yogita', label: 'yo' },
  ]);

  useEffect(() => {
    axios
      .get('https://damp-garden-93707.herokuapp.com/getlistofagents')
      .then(response => setAgentList(response.data.data.listofagents));
  });

  const getLabeledAgentData = () => {
    const labeledData = agentList.length
      ? agentList.map(value => ({
          value,
          label: value,
        }))
      : [];
    return labeledData;
  };

  const labeledAgentData = getLabeledAgentData()
//   console.log(selectedOption);

  const handleSelectAgent = val => {
    setSelectedOption(val);
    // console.log(selectedOption)

  };

  const getValue = () => selectedOption

  return (
    <Select
          mode="multiple"
          // onChange={(value) => console.log(value)}
        >
          {labeledAgentData.map((agent) => {
            // console.log(option);
            return <Option value={agent.value}>{agent.label}</Option>;
          })}
    </Select>
    
  );
}


// <div className="App">
      // <Select
      //   // onChange={setSelectedOption}
      //   options={getLabeledAgentData()}
      //   // value={selectedOption[0].value}
      //   isMulti
      //   // options={getListOfAgentsArray()}
      //   onChange={handleSelectAgent}
      //   value={selectedOption}
      //   required
      //   isSearchable
      // />
      {/* {enableRequired && ( */}
          {/* <input
            tabIndex={-1}
            autoComplete="off"
            style={{
              opacity: 0,
              width: "100%",
              height: 0,
              position: "absolute"
            }}
            value={getValue()}
            onChange={() => {}}
            // onFocus={() => this.selectRef.focus()}
            required */}
          {/* /> */}
        {/* )} */}
    // </div>