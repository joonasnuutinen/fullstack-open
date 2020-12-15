import { v1 as uuid } from 'uuid';
import patientData from '../../data/patients.json';
import { Patient, NewPatient, PublicPatient } from '../types';
import { toNewPatient } from '../utils';

const patients: Patient[] = patientData.map(p => {
  const patient = toNewPatient(p) as Patient;
  patient.id = p.id;
  patient.entries = [];
  return patient;
});

const getPatients = (): PublicPatient[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patients.map(({ ssn, ...otherFields }) => otherFields);
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    ...patient,
    id: uuid(),
    entries: []
  };
  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getPatientById,
  addPatient
};
