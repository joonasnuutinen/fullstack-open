import { v1 as uuid } from 'uuid';
import patientData from '../../data/patients.json';
import { Patient } from '../types';

const patients: Array<Patient> = patientData;

const getEntries = (): Omit<Patient, 'ssn'>[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patients.map(({ ssn, ...otherFields }) => otherFields);
};

const addPatient = (
  name: string, dateOfBirth: string, ssn: string, gender: string, occupation: string
): Patient => {
  const newPatient = {
    id: uuid(),
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
  };
  patients.push(newPatient);
  return newPatient;
};

export default {
  getEntries,
  addPatient
};
