import express = require('express');
import bmiCalc from './bmiCalculator'
const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  
  if (isNaN(height) || isNaN(weight)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }
  
  const bmi = bmiCalc(height, weight);
  res.json({ weight, height, bmi })
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
