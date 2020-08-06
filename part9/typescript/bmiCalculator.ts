import { calculateBmi, BMIInput } from './calculators/bmi';

const parseBmiArgs = (args: Array<string>): BMIInput => {
  if (args.length < 2) throw new Error('Not enough arguments');

  const height = Number(args[0]);
  const weight = Number(args[1]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error('Provided values were not numbers!');
  }

  return { height, weight };
};

try {
  const bmiArgs = parseBmiArgs(process.argv.slice(2));
  console.log(calculateBmi(bmiArgs.height, bmiArgs.weight));
} catch (e) {
  console.error('Something went wrong:', (e as Error).message);
}
