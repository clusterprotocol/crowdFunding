// utils/index.ts

/**
 * Calculates the number of days left until the given deadline.
 * @param deadline - A date string or number (timestamp).
 * @returns The number of days left as a string (rounded).
 */
export const daysLeft = (deadline: string | number | Date): string => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);
    return remainingDays.toFixed(0);
  };
  
  /**
   * Calculates the percentage of the goal that has been raised.
   * @param goal - Target amount in ETH (as string or number).
   * @param raisedAmount - Amount collected so far (as string or number).
   * @returns Percentage number (0–100+).
   */
  export const calculateBarPercentage = (
    goal: string | number,
    raisedAmount: string | number
  ): number => {
    const goalNum = typeof goal === 'string' ? parseFloat(goal) : goal;
    const raisedNum = typeof raisedAmount === 'string' ? parseFloat(raisedAmount) : raisedAmount;
  
    if (goalNum === 0) return 0; // prevent divide by zero
  
    const percentage = Math.round((raisedNum * 100) / goalNum);
    return percentage;
  };
  