import express from 'express';
import diagnosesRouter from './routes/diagnoses';

const app = express();
app.use(express.json());

const PORT = 3001;

app.get('/api/ping', (_, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diagnoses', diagnosesRouter);

app.get('/api/patients', (_, res) => {
  res.send([]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
