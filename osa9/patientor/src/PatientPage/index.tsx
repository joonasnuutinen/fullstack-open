import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Icon } from 'semantic-ui-react';

import { useStateValue, updatePatient } from '../state';
import { apiBaseUrl } from '../constants';
import { Patient, GenderIcon, Entry } from '../types';

const EntryDisplay: React.FC<{ entry: Entry }> = ({ entry }) => (
  <div>
    <p>{entry.description}</p>
    {entry.diagnosisCodes &&
      <ul>
        {entry.diagnosisCodes.map(code => <li key={code}>{code}</li>)}
      </ul>
    }
  </div>
);

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const patient = patients[id];

  React.useEffect(() => {
    if (patient?.ssn) return; // Detailed data already fetched

    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatient();
  }, [dispatch, id, patient]);
  
  if (!patient) return null;

  return (
    <div>
      <h2>{patient.name} <Icon name={GenderIcon[patient.gender]} /></h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <h3>entries</h3>
      {patient.entries?.length > 0 ?
        <div>
          {patient.entries.map(entry => <EntryDisplay key={entry.id} entry={entry} />)}
        </div>
        :
        <div>No entries</div>
      }
    </div>
  );
};

export default PatientPage;
