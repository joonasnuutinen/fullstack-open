import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Icon } from 'semantic-ui-react';

import { useStateValue } from '../state';
import { apiBaseUrl } from '../constants';
import { Patient, GenderIcon } from '../types';

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch({ type: 'UPDATE_PATIENT', payload: patientFromApi });
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatient();
  }, [id, dispatch]);
  
  const patient = patients[id];
  if (!patient) return null;

  return (
    <div>
      <h2>{patient.name} <Icon name={GenderIcon[patient.gender]} /></h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
    </div>
  );
};

export default PatientPage;
