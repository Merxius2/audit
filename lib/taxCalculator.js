/**
 * Tax Calculator Library
 * Calculates Dutch income tax with detailed breakdown by bracket
 * Supports gross→net and net→gross calculations
 */

export const calculateTaxBreakdown = (grossIncome, taxBrackets, taxCredit, socialSecurityRate) => {
  if (grossIncome <= 0) {
    return {
      grossIncome: 0,
      incomeTax: 0,
      socialSecurity: 0,
      totalTax: 0,
      netIncome: 0,
      effectiveRate: 0,
      bracketsBreakdown: [],
      taxCredit: 0,
    };
  }

  let incomeTax = 0;
  const bracketsBreakdown = [];

  // Calculate tax by bracket
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
      });
    }
  }

  // Apply tax credit
  incomeTax = Math.max(0, incomeTax - taxCredit);

  // Calculate social security contributions
  const socialSecurity = grossIncome * socialSecurityRate;

  // Total tax and net income
  const totalTax = incomeTax + socialSecurity;
  const netIncome = grossIncome - totalTax;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome,
    incomeTax,
    socialSecurity,
    totalTax,
    netIncome,
    effectiveRate,
    bracketsBreakdown,
    taxCredit,
  };
};

export const calculateGrossFromNet = (netIncome, taxBrackets, taxCredit, socialSecurityRate) => {
  if (netIncome <= 0) {
    return {
      grossIncome: 0,
      incomeTax: 0,
      socialSecurity: 0,
      totalTax: 0,
      netIncome: 0,
      effectiveRate: 0,
      bracketsBreakdown: [],
      taxCredit: 0,
    };
  }

  // Iterative approach to find gross income that results in target net income
  // Since tax depends on gross, we need to solve: netIncome = grossIncome - tax(grossIncome)
  
  let low = netIncome;
  let high = netIncome * 2.5; // Upper bound estimate
  let gross = low;

  // Binary search for the correct gross income
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const result = calculateTaxBreakdown(mid, taxBrackets, taxCredit, socialSecurityRate);
    
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

  return calculateTaxBreakdown(gross, taxBrackets, taxCredit, socialSecurityRate);
};

export const calculateWithExpatDiscount = (result, isExpat) => {
  if (!isExpat) return result;

  // Apply 30% expat income discount to gross income
  const discountedGross = result.grossIncome * 0.7;
  
  return {
    ...result,
    grossIncome: discountedGross,
    expatDiscountApplied: true,
    expatDiscountAmount: result.grossIncome * 0.3,
    originalGrossIncome: result.grossIncome,
  };
};
