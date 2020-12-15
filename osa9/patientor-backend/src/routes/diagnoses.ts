import express from 'express';
import diaryService from '../services/diagnosisService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diaryService.getEntries());
});

export default router;
