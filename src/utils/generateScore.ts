export function generateScore(mean = 70, stdDev = 10): number {
  let num = 0;

  // Box-Muller transform to generate a normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  num = Math.round(z * stdDev + mean);

  // Ensure the score is between 0 and 100
  if (num < 0) {
    num = 0;
  } else if (num > 100) {
    num = 100;
  }

  return num;
}
