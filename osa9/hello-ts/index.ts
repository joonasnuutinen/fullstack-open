import express = require('express');
import bmiCalc from './bmiCalculator';
import exerciseCalc, { InputValues } from './exerciseCalculator';

const app = express();
app.use(express.json());

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
  res.json({ weight, height, bmi });
});

app.post('/exercises', (req, res) => {
  interface ExerciseBody {
    daily_exercises: Array<number>;
    target: number;
  }

  const parseBody = (body: ExerciseBody): InputValues => {
    const { daily_exercises, target } = body;
    if (!daily_exercises || !target) {
      throw new Error('parameters missing');
    }
    if (isNaN(target) || daily_exercises.some(t => isNaN(t))) {
      throw new Error('malformatted parameters');
    }
    return { hours: daily_exercises, target };
  };
  
  try {
    const { hours, target } = parseBody(req.body);
    const result = exerciseCalc(hours, target);
    res.json(result);
  } catch ({ message }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    res.status(400).json({ error: message });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
