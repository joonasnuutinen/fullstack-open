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
}

console.log(calculateBmi(180, 74));
