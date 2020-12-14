interface Measurements {
  height: number;
  weight: number;
}

const parseArguments = (args: Array<string>): Measurements => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error('Provided values are not numbers');
  }
  
  return { height, weight };
};

const calculateBmi = (height: number, weight: number): string => {
  const hm = height / 100;
  const bmi = weight / (hm * hm);
  let cat;
  if (bmi < 15) {
    cat = 'Very severely underweight';
  } else if (bmi < 16) {
    cat = 'Severely underweight';
  } else if (bmi < 18.5) {
    cat = 'Underweight';
  } else if (bmi < 25) {
    cat = 'Normal (healthy weight)';
  } else if (bmi < 30) {
    cat = 'Overweight';
  } else if (bmi < 35) {
    cat = 'Obese Class I (Moderately obese)';
  } else if (bmi < 40) {
    cat = 'Obese Class II (Severely obese)';
  } else {
    cat = 'Obese Class III (Very severely obese)';
  }
  return cat;
};

if (require.main === module) {
  // Called directly
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.error('An error occurred:', e.message);
  }
}

export default calculateBmi;
