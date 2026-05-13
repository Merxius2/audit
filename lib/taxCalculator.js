/**
 * Tax Calculator Library - Netherlands Income Tax
 * Calculates Dutch income tax with tax brackets (including social security) and credits
 * Supports gross→net and net→gross calculations
 * 
 * IMPORTANT: Tax bracket rates already INCLUDE mandatory social security contributions (premies volksverzekeringen)
 * No separate social security calculation is needed
 */

/**
 * Calculate General Tax Credit (Algemene Heffingskorting) with phase-out
 * Based on official Dutch tax brackets for the selected year
 */
const calculateGeneralTaxCredit = (annualIncome, creditBrackets) => {
  if (annualIncome <= creditBrackets.bracket1.max) {
    return creditBrackets.bracket1.credit;
  }
  
  if (annualIncome <= creditBrackets.bracket2.end) {
    // Phase-out calculation: baseCredit - (phaseOutRate * (income - start))
    const phaseOutAmount = creditBrackets.bracket2.phaseOutRate * (annualIncome - creditBrackets.bracket2.start);
    return Math.max(0, creditBrackets.bracket2.baseCredit - phaseOutAmount);
  }
  
  return 0;
};

/**
 * Calculate Earned Income Credit (Arbeidskorting) with phase-out
 * Based on official Dutch tax brackets for the selected year
 */
const calculateEarnedIncomeCredit = (annualIncome, creditBrackets) => {
  for (const bracket of creditBrackets) {
    if (bracket.credit === 0) {
      return 0;
    }
    
    if (bracket.max && annualIncome <= bracket.max) {
      // First bracket: simple percentage
      if (bracket.rate && annualIncome <= bracket.max) {
        return annualIncome * bracket.rate;
      }
    }
    
    if (bracket.min && bracket.max && annualIncome >= bracket.min && annualIncome <= bracket.max) {
      // Middle brackets: base + percentage of amount above threshold
      const amountAboveThreshold = annualIncome - bracket.min;
      return Math.max(0, bracket.base + (amountAboveThreshold * bracket.rate));
    }
    
    if (bracket.min && !bracket.max && annualIncome >= bracket.min) {
      // Last bracket or open-ended
      if (bracket.credit === 0) {
        return 0;
      }
      const amountAboveThreshold = annualIncome - bracket.min;
      return Math.max(0, bracket.base + (amountAboveThreshold * bracket.rate));
    }
  }
  
  return 0;
};

export const calculateTaxBreakdown = (grossIncome, taxBrackets, generalTaxCreditBrackets, earnedIncomeCreditBrackets) => {
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

  // Apply General Tax Credit (Algemene Heffingskorting) with proper phase-out
  const actualGeneralCredit = calculateGeneralTaxCredit(grossIncome, generalTaxCreditBrackets);
  incomeTax = Math.max(0, incomeTax - actualGeneralCredit);

  // Apply Earned Income Credit (Arbeidskorting) with proper phase-out
  const earnedIncomeCreditAmount = calculateEarnedIncomeCredit(grossIncome, earnedIncomeCreditBrackets);
  const creditAmountAfterTax = Math.min(earnedIncomeCreditAmount, Math.max(0, incomeTax));
  incomeTax = Math.max(0, incomeTax - creditAmountAfterTax);

  // Total credits applied
  const totalCredits = actualGeneralCredit + creditAmountAfterTax;

  // Total tax and net income
  const totalTax = incomeTax;
  const netIncome = grossIncome - totalTax;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome,
    incomeTax,
    generalTaxCredit: actualGeneralCredit,
    earnedIncomeCreditAmount: creditAmountAfterTax,
    totalCredits,
    totalTax,
    netIncome,
    effectiveRate,
    bracketsBreakdown,
  };
};

export const calculateGrossFromNet = (netIncome, taxBrackets, generalTaxCreditBrackets, earnedIncomeCreditBrackets) => {
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
  let low = netIncome;
  let high = netIncome * 2.5;
  let gross = low;

  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const result = calculateTaxBreakdown(mid, taxBrackets, generalTaxCreditBrackets, earnedIncomeCreditBrackets);
    
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
  return calculateTaxBreakdown(gross, taxBrackets, generalTaxCreditBrackets, earnedIncomeCreditBrackets);
};
