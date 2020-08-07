import { Diagnosis } from '../types';
import diagnosisData from '../data/diagnoses';

const getAll = (): Diagnosis[] => {
  return diagnosisData;
};

export default {
  getAll,
};
