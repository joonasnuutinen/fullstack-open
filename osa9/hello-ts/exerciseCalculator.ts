interface ResultObject {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
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
  }

  return {
    periodLength,
    trainingDays: hours.filter(h => h > 0).length,
    target,
    average,
    success: average >= target,
    rating,
    ratingDescription: ratingMappings[rating]
  }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))
