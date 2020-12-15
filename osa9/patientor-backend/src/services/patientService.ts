import patientData from '../../data/patients.json';
import { Patient } from '../types';

const patients: Array<Patient> = patientData;

const getEntries = (): Omit<Patient, 'ssn'>[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patients.map(({ ssn, ...otherFields }) => otherFields);
};

export default {
  getEntries
};
