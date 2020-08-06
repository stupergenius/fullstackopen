interface ExerciseSummary {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

export interface ExerciseInput {
  dailyHours: Array<number>
  targetHours: number
}

const descriptionForRating = (rating: number): string => {
  switch (rating) {
    case 1:
      return 'maybe next time...';
    case 2:
      return 'not too bad but could be better';
    case 3:
    default:
      return 'superb - keep at it';
  }
};

export const calculateExercises = (dailyHours: Array<number>, targetHours: number): ExerciseSummary => {
  if (targetHours <= 0) throw new Error('Target hours should be greater than zero #workForIt');
  if (dailyHours.findIndex(h => h < 0) != -1) throw new Error('Each daily hour should be zero or a positive number #workForIt');

  const totalHours = dailyHours.reduce((acc, hours) => acc + hours, 0);
  const periodLength = dailyHours.length;
  const average = totalHours / periodLength;
  const normDelta = Math.min(1 - ((targetHours - average) / targetHours), 1);
  const rating = Math.floor(2 * normDelta) + 1;

  return {
    periodLength,
    trainingDays: dailyHours.filter(d => d > 0).length,
    success: average >= targetHours,
    rating,
    ratingDescription: descriptionForRating(rating),
    target: targetHours,
    average,
  };
};
