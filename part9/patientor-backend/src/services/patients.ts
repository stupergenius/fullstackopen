import { Patient, NonSensitivePatient } from '../types';
import patientData from '../data/patients';

const getAll = (): Patient[] => {
  return patientData;
};

const getAllNonSensitiveEntries = (): NonSensitivePatient[] => {
  // typescript is dumb and you cant used typed Object operations like Object.entries, etc.
  // https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
  // so you get this gem of a solution:

  return patientData.map(p => ({
    id: p.id,
    name: p.name,
    dateOfBirth: p.dateOfBirth,
    gender: p.gender,
    occupation: p.occupation,
  }));
};

export default {
  getAll,
  getAllNonSensitiveEntries,
};
