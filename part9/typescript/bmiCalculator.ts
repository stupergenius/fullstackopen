type Kilograms = number
type Centimeters = number

interface BMIInput {
  height: Centimeters
  weight: Kilograms
}

const calculateBmi = (height: Centimeters, weight: Kilograms) => {
  const heightMetersSquared = Math.pow(height / 100.0, 2)
  const bmi = weight / heightMetersSquared

  if (bmi < 15) {
    return 'Very severely underweight'
  } else if (bmi < 16) {
    return 'Severely underweight'
  } else if (bmi < 18.5) {
    return 'Underweight'
  } else if (bmi < 25) {
    return 'Normal (healthy weight)'
  } else if (bmi < 30) {
    return 'Overweight'
  } else if (bmi < 35) {
    return 'Obese Class I (Moderately obese)'
  } else if (bmi < 40) {
    return 'Obese Class II (Severely obese)'
  } else {
    return 'Obese Class III (Very severely obese)'
  }
}

const parseBmiArgs = (args: Array<string>): BMIInput => {
  if (args.length < 2) throw new Error('Not enough arguments')

  const height = Number(args[0])
  const weight = Number(args[1])

  if (isNaN(height) || isNaN(weight)) {
    throw new Error('Provided values were not numbers!')
  }

  return { height, weight }
}

try {
  const bmiArgs = parseBmiArgs(process.argv.slice(2))
  console.log(calculateBmi(bmiArgs.height, bmiArgs.weight))
} catch (e) {
  console.error('Something went wrong:', e.message)
}
