import express from 'express';
import { calculateBmi } from './calculators/bmi';
import { calculateExercises } from './calculators/exercises';

const app = express();
app.use(express.json());

interface ExercisesBody {
  daily_exercises: Array<number>
  target: number
}

app.get('/hello', (_, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  const heightInput = Number(height);
  const weightInput = Number(weight);
  if (Number.isNaN(heightInput) || Number.isNaN(weightInput)) {
    return res.status(400).send({ error: 'maformatted parameters' });
  }

  try {
    const bmi = calculateBmi(heightInput, weightInput);
    return res.send({ height, weight, bmi });
  } catch (e) {
    return res.status(400).send({ error: 'maformatted parameters' });
  }
});

app.post('/exercises', (req, res) => {
  const input = req.body as ExercisesBody;
  if (input === null || input === undefined
    || input.daily_exercises === null || input.daily_exercises === undefined
    || input.target === null || input.target === undefined) {
    return res.status(400).send({ error: 'parameters missing' });
  }
  if (!Array.isArray(input.daily_exercises) || Number.isNaN(Number(input.target))) {
    return res.status(400).send({ error: 'maformatted parameters' });
  }

  try {
    const summary = calculateExercises(input.daily_exercises, input.target);
    return res.send(summary);
  } catch (e) {
    return res.status(400).send({ error: 'maformatted parameters' });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
