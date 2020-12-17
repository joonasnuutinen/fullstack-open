import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Icon, Segment, Button } from 'semantic-ui-react';

import { useStateValue, updatePatient, addEntry } from '../state';
import { apiBaseUrl } from '../constants';
import {
  Patient,
  GenderIcon,
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
  HealthCheckRating,
  IconColor
} from '../types';
import { assertNever } from '../utils';
import AddEntityModal from '../AddEntityModal';
import AddEntryForm, { EntryFormValues } from '../AddEntityModal/AddEntryForm';

const DiagnosisList: React.FC< { diagnosisCodes: string[] } > = ({ diagnosisCodes }) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <ul>
      {diagnosisCodes.map(code =>
        <li key={code}>{code} {diagnoses[code]?.name}</li>
      )}
    </ul>
  );
};

const HospitalEntryDisplay: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <Segment>
      <h4>{entry.date} <Icon name="hospital" /></h4>
      <p>{entry.description}</p>
      <h5>Discharge</h5>
      <p>{entry.discharge.date}: {entry.discharge.criteria}</p>
      {entry.diagnosisCodes &&
        <div>
          <h4>Diagnoses</h4>
          <DiagnosisList diagnosisCodes={entry.diagnosisCodes} />
        </div>
      }
    </Segment>
  );
};

const OccupationalHealthcareEntryDisplay: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
  return (
    <Segment>
      <h4>{entry.date} <Icon name="briefcase" /> {entry.employerName}</h4>
      <p>{entry.description}</p>
      {entry.sickLeave &&
        <p>
          Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </p>
      }
      {entry.diagnosisCodes &&
        <div>
          <h4>Diagnoses</h4>
          <DiagnosisList diagnosisCodes={entry.diagnosisCodes} />
        </div>
      }
    </Segment>
  );
};

const HealthCheckHeart: React.FC<{ rating: HealthCheckRating }> = ({ rating }) => {
  const colors: IconColor[] = ['green', 'yellow', 'orange', 'red'];
  return <Icon name="heart" color={colors[rating]} />;
};

const HealthCheckEntryDisplay: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  return (
    <Segment>
      <h4>{entry.date} <Icon name="doctor" /></h4>
      <p>{entry.description}</p>
      <HealthCheckHeart rating={entry.healthCheckRating} />
      {entry.diagnosisCodes &&
        <div>
          <h4>Diagnoses</h4>
          <DiagnosisList diagnosisCodes={entry.diagnosisCodes} />
        </div>
      }
    </Segment>
  );
};

const EntryDisplay: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDisplay entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDisplay entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryDisplay entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const patient = patients[id];

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addEntry(id, newEntry));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

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
      <AddEntityModal
        modalOpen={modalOpen}
        /*onSubmit={submitNewEntry}*/
        error={error}
        onClose={closeModal}
        entityName="entry"
      >
        <AddEntryForm onSubmit={submitNewEntry} onCancel={closeModal} />
      </AddEntityModal>
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientPage;
