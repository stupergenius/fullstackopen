import { calculateExercises, ExerciseInput } from './calculators/exercises';

const parseExerciseArgs = (args: Array<string>): ExerciseInput => {
  if (args.length < 2) throw new Error('Not enough arguments');

  const targetHours = Number(args[0]);
  const dailyHours = args
    .slice(1)
    .map(h => Number(h))
    .filter(h => !Number.isNaN(h));

  if (isNaN(targetHours) || dailyHours.length === 0) {
    throw new Error('Provided values were not numbers!');
  }

  return { targetHours, dailyHours };
};

try {
  const exerciseArgs = parseExerciseArgs(process.argv.slice(2));
  console.log(calculateExercises(exerciseArgs.dailyHours, exerciseArgs.targetHours));
} catch (e) {
  console.error('Something went wrong:', (e as Error).message);
}
