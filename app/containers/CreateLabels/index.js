/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import FormContainer from './Form';

export default function LabelsContainer() {
  return (
    <div>
      <Helmet>
        <title>Part 2</title>
        <meta
          name="description"
          content="Feature page of React.js Boilerplate application"
        />
      </Helmet>
      <FormContainer />
    </div>
  );
}
