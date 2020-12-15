import diagnoseData from '../../data/diagnoses.json';
import { Diagnose } from '../types';

const diagnoses: Array<Diagnose> = diagnoseData;

const getEntries = (): Array<Diagnose> => {
  return diagnoses;
};

export default {
  getEntries
};
