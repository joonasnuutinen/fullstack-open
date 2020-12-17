import { v1 as uuid } from 'uuid';
import patients from '../../data/patients';
import { Patient, NewPatient, PublicPatient, NewEntry, Entry } from '../types';
/*import { toNewPatient } from '../utils';

const patients: Patient[] = patientData.map(p => {
  const patient = toNewPatient(p) as Patient;
  patient.id = p.id;
  return patient;
});
*/
const getPatients = (): PublicPatient[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patients.map(({ ssn, entries, ...otherFields }) => otherFields);
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient: Patient = {
    ...patient,
    id: uuid(),
    entries: []
  };
  patients.push(newPatient);
  return newPatient;
};

const addPatientEntry = (id: string, newEntry: NewEntry): Entry | null => {
  const entry: Entry = {
    ...newEntry,
    id: uuid()
  };
  const patient = patients.find(p => p.id === id);
  if (!patient) {
    throw new Error(`Cannot find patient with id ${id}`);
  }
  
  patient.entries.push(entry);
  return entry;
};

export default {
  getPatients,
  getPatientById,
  addPatient,
  addPatientEntry
};
