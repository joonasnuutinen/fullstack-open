interface InputValues {
  target: number;
  hours: Array<number>
}

interface ResultObject {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
}

const parseExerciseArguments = (args: Array<string>): InputValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const numericValues = args.slice(2).map(a => Number(a));

  if (numericValues.some(v => isNaN(v))) {
    throw new Error('All values must be numbers');
  }

  return { target: numericValues[0], hours: numericValues.slice(1) };
}

const calculateExercises = (hours: Array<number>, target: number): ResultObject => {
  const sum = hours.reduce((s, h) => s + h);
  const periodLength = hours.length;
  const average = sum / periodLength;
  
  let rating: 1 | 2 | 3;
  if (average < target / 2) {
    rating = 1;
  } else if (average < target) {
    rating = 2;
  } else {
    rating = 3;
  }

  const ratingMappings = {
    1: 'Maybe try a bit more?',
    2: 'Almost there!',
    3: 'Great job!'
  };

  return {
    periodLength,
    trainingDays: hours.filter(h => h > 0).length,
    target,
    average,
    success: average >= target,
    rating,
    ratingDescription: ratingMappings[rating]
  };
}

try {
  const { target, hours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(hours, target));
} catch (e) {
  console.error('An error occurred:', e.message)
}
