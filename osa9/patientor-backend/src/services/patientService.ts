import { v1 as uuid } from 'uuid';
import patientData from '../../data/patients.json';
import { Patient, NewPatient } from '../types';
import { toNewPatient } from '../utils';

const patients: Patient[] = patientData.map(p => {
  const patient = toNewPatient(p) as Patient;
  patient.id = p.id;
  return patient;
});

const getEntries = (): Omit<Patient, 'ssn'>[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patients.map(({ ssn, ...otherFields }) => otherFields);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    id: uuid(),
    ...patient
  };
  patients.push(newPatient);
  return newPatient;
};

export default {
  getEntries,
  addPatient
};
