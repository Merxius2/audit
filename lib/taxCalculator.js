/**
 * Tax Calculator Library - Netherlands Income Tax
 * Calculates Dutch income tax with tax brackets (including social security) and credits
 * Supports gross→net and net→gross calculations
 * 
 * IMPORTANT: Tax bracket rates already INCLUDE mandatory social security contributions (premies volksverzekeringen)
 * No separate social security calculation is needed
 */

/**
 * Calculate tax credits with phase-out
 * In Netherlands: credits decrease as income increases above threshold
 */
const calculateCreditWithPhaseOut = (annualIncome, maxCredit, phaseOutStart, phaseOutRate) => {
  if (annualIncome <= phaseOutStart) {
    return maxCredit;
  }
  const phaseOutAmount = (annualIncome - phaseOutStart) * phaseOutRate;
  return Math.max(0, maxCredit - phaseOutAmount);
};

export const calculateTaxBreakdown = (grossIncome, taxBrackets, generalTaxCredit, earnedIncomeCredit) => {
  if (grossIncome <= 0) {
    return {
      grossIncome: 0,
      incomeTax: 0,
      generalTaxCredit: 0,
      earnedIncomeCreditAmount: 0,
      totalCredits: 0,
      totalTax: 0,
      netIncome: 0,
      effectiveRate: 0,
      bracketsBreakdown: [],
    };
  }

  let incomeTax = 0;
  const bracketsBreakdown = [];

  // Calculate income tax by bracket
  // Note: rates already include social security contributions
  for (const bracket of taxBrackets) {
    if (grossIncome > bracket.min) {
      const incomeInBracket = Math.min(grossIncome, bracket.max) - bracket.min;
      const taxInBracket = incomeInBracket * bracket.rate;
      incomeTax += taxInBracket;

      bracketsBreakdown.push({
        min: bracket.min,
        max: bracket.max,
        rate: bracket.rate,
        incomeInBracket: incomeInBracket,
        taxInBracket: taxInBracket,
        cumulativeTax: incomeTax,
        label: bracket.label,
        description: bracket.description,
      });
    }
  }

  // Apply General Tax Credit (Algemene Heffingskorting)
  // This credit doesn't phase out in most Dutch systems for low-middle incomes
  const actualGeneralCredit = Math.min(generalTaxCredit, incomeTax);
  incomeTax -= actualGeneralCredit;

  // Apply Earned Income Credit (Arbeidskorting)
  // This is a refundable credit that phases out with income
  const actualEarnedIncomeCredit = Math.min(
    earnedIncomeCredit.maxCredit,
    calculateCreditWithPhaseOut(
      grossIncome,
      earnedIncomeCredit.maxCredit,
      earnedIncomeCredit.phaseOutStart,
      earnedIncomeCredit.phaseOutRate
    )
  );
  const earnedIncomeCreditAmount = Math.min(actualEarnedIncomeCredit, Math.max(0, incomeTax));
  incomeTax = Math.max(0, incomeTax - earnedIncomeCreditAmount);

  // Total credits applied
  const totalCredits = actualGeneralCredit + earnedIncomeCreditAmount;

  // Total tax and net income
  const totalTax = incomeTax;
  const netIncome = grossIncome - totalTax;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome,
    incomeTax,
    generalTaxCredit: actualGeneralCredit,
    earnedIncomeCreditAmount: earnedIncomeCreditAmount,
    totalCredits,
    totalTax,
    netIncome,
    effectiveRate,
    bracketsBreakdown,
  };
};

export const calculateGrossFromNet = (netIncome, taxBrackets, generalTaxCredit, earnedIncomeCredit) => {
  if (netIncome <= 0) {
    return {
      grossIncome: 0,
      incomeTax: 0,
      generalTaxCredit: 0,
      earnedIncomeCreditAmount: 0,
      totalCredits: 0,
      totalTax: 0,
      netIncome: 0,
      effectiveRate: 0,
      bracketsBreakdown: [],
    };
  }

  // Binary search to find gross income that results in target net income
  // Since tax depends on gross income and credits phase out with income, we need to iterate
  
  let low = netIncome;
  let high = netIncome * 2.5; // Upper bound estimate
  let gross = low;

  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const result = calculateTaxBreakdown(mid, taxBrackets, generalTaxCredit, earnedIncomeCredit);
    
    if (Math.abs(result.netIncome - netIncome) < 0.01) {
      gross = mid;
      break;
    }
    
    if (result.netIncome < netIncome) {
      low = mid;
    } else {
      high = mid;
    }
    gross = mid;
  }

  // Final calculation with the found gross income
  return calculateTaxBreakdown(gross, taxBrackets, generalTaxCredit, earnedIncomeCredit);
};
