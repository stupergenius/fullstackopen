interface ExerciseSummary {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

const descriptionForRating = (rating: number): string => {
  switch (rating) {
    case 1:
      return 'maybe next time...'
    case 2:
      return 'not too bad but could be better'
    case 3:
    default:
      return 'superb - keep at it'
  }
}

const calculateExercises = (dailyHours: Array<number>, targetHours: number): ExerciseSummary => {
  const totalHours = dailyHours.reduce((acc, hours) => acc + hours, 0)
  const periodLength = dailyHours.length
  const average = totalHours / periodLength
  const normDelta = Math.min(1 - ((targetHours - average) / targetHours), 1)
  const rating = Math.floor(2 * normDelta) + 1

  return {
    periodLength,
    trainingDays: dailyHours.filter(d => d > 0).length,
    success: average >= targetHours,
    rating,
    ratingDescription: descriptionForRating(rating),
    target: targetHours,
    average,
  }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))
