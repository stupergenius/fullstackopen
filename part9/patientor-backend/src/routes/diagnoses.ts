import express from 'express';
import diagnosisService from '../services/diagnoses';

const router = express.Router();

router.get('/', (_, res) => {
  const diagnoses = diagnosisService.getAll();
  res.send(diagnoses);
});

export default router;
