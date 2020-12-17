import React from 'react';
import { Formik, Form, Field } from 'formik';

import { HealthCheckRating, HealthCheckEntry } from '../types';
import { DiagnosisSelection, FormButtons, TextField, NumberField } from './FormField';
import { useStateValue } from '../state';

export type EntryFormValues = Omit<HealthCheckEntry, 'id' | 'date'>;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnoses }] = useStateValue();
  
  return (
    <Formik
      initialValues={{
        type: 'HealthCheck',
        description: '',
        specialist: '',
        diagnosisCodes: [],
        healthCheckRating: HealthCheckRating.Healthy
      }}
      onSubmit={onSubmit}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) =>
        <Form className="form ui">
          <Field
            label="Description"
            placeholder="Description"
            name="description"
            component={TextField}
          />
          <Field
            label="Specialist"
            placeholder="Specialist"
            name="specialist"
            component={TextField}
          />
          <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          />
          <Field
            label="Rating"
            placeholder="Rating"
            name="healthCheckRating"
            component={NumberField}
            min={0}
            max={3}
          />
          <FormButtons onCancel={onCancel} submitDisabled={!dirty || !isValid} />
        </Form>
      }
    </Formik>
  );
};

export default AddEntryForm;
