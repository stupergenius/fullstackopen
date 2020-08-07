import { Router } from 'express';
import patientService from '../services/patients';

const router = Router();

router.get('/', (_, res) => {
  res.send(patientService.getAllNonSensitiveEntries());
});

export default router;