import express from 'express';
import calculateBmi from './bmiCalculator';

const app = express();

app.use('/hello', (_, res) => {
  res.send('Hello Full Stack!');
});

app.use('/bmi', (req, res) => {
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

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
