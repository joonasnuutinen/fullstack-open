/* eslint-disable
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/restrict-template-expressions,
  @typescript-eslint/explicit-module-boundary-types,
  @typescript-eslint/no-unsafe-member-access
*/
import {
  NewPatient,
  Gender,
  NewEntry,
  NewBaseEntry,
  Diagnosis,
  Discharge,
  SickLeave,
  HealthCheckRating
} from './types';

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isStringArray = (arr: any): arr is Array<string> => {
  return arr instanceof Array && arr.every(isString);
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isSsn = (ssn: string): boolean => {
  // Not a valid check but detects some errors
  const re = /[0-3]\d[01]\d{3}[+-A]\d{3}[0-9A-Z]/;
  return re.test(ssn);
};

const isGender = (gender: any): gender is Gender => {
  return Object.values(Gender).includes(gender);
};

const isHealthCheckRating = (rating: any): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(rating);
};

const parseName = (name: any): string => {
  if (!name || !isString(name)) {
    throw new Error(`Incorrect or missing name: ${name}`);
  }
  return name;
};

const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error(`Incorrect or missing date: ${date}`);
  }
  return date;
};

const parseSsn = (ssn: any): string => {
  if (!ssn || !isString(ssn) || !isSsn(ssn)) {
    throw new Error(`Incorrect or missing ssn: ${ssn}`);
  }
  return ssn;
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error(`Incorrect or missing gender: ${gender}`);
  }
  return gender;
};

const parseOccupation = (occupation: any): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error(`Incorrect or missing occupation: ${occupation}`);
  }
  return occupation;
};

const parseString = (str: any): string => {
  if (!str || !isString(str)) {
    throw new Error(`Cannot interpret as string: ${str}`);
  }
  return str;
};

const parseDiagnosisCodes = (value: any): Array<Diagnosis['code']> | undefined => {
  if (!value) return undefined;
  if (!isStringArray(value)) {
    throw new Error(`Cannot interpret as an array of diagnosis codes: ${value}`);
  }
  return value;
};

const parseDischarge = (d: any): Discharge => {
  const discharge: Discharge = {
    date: parseDate(d.date),
    criteria: parseString(d.criteria)
  };
  return discharge;
};

const parseSickLeave = (s: any): SickLeave | undefined => {
  if (!s) return undefined;
  const sickLeave: SickLeave = {
    startDate: parseDate(s.startDate),
    endDate: parseDate(s.endDate)
  };
  return sickLeave;
};

const parseHealthCheckRating = (rating: any): HealthCheckRating => {
  if (rating === undefined || !isHealthCheckRating(rating)) {
    throw new Error(`Cannot interpret healthCheckRating: ${rating}`);
  }
  return rating;
};

const getDateString = (): string => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const toNewPatient = (object: any): NewPatient => {
  const newPatient: NewPatient = {
    name: parseName(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseSsn(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation)
  };

  return newPatient;
};

export const toNewEntry = (object: any): NewEntry => {
  const newBaseEntry: NewBaseEntry = {
    description: parseString(object.description),
    date: parseDate(getDateString()),
    specialist: parseString(object.specialist),
    diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes)
  };
  const type = parseString(object.type);
  let newEntry: NewEntry;
  
  switch (type) {
    case 'Hospital':
      newEntry = {
        ...newBaseEntry,
        type,
        discharge: parseDischarge(object.discharge)
      };
      break;
    case 'OccupationalHealthcare':
      newEntry = {
        ...newBaseEntry,
        type,
        employerName: parseString(object.employerName),
        sickLeave: parseSickLeave(object.sickLeave)
      };
      break;
    case 'HealthCheck':
      newEntry = {
        ...newBaseEntry,
        type,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
      };
      break;
    default:
      throw new Error(`Unknown entry type: ${type}`);
  }

  return newEntry;
};
