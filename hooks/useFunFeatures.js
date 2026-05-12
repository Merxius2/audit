import { useEffect } from 'react';
import { useSecretModes } from '../context/SecretModesContext';

export function useFunFeatures(totalIncome, totalExpenses, expenses = {}) {
  const { confettiMode, roastMode } = useSecretModes();

  // Trigger confetti when savings goal is met (leftover >= 500)
  useEffect(() => {
    if (confettiMode) {
      const leftover = totalIncome - totalExpenses;
      if (leftover >= 500) {
        triggerConfetti();
      }
    }
  }, [totalIncome, totalExpenses, confettiMode]);

  return {
    applicableRoasts: roastMode ? generateRoastMessage(totalIncome, totalExpenses, expenses) : [],
  };
}

function triggerConfetti() {
  // Create multiple confetti pieces
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Random colors
    const colors = ['#ff4444', '#ffbb33', '#00c9a7', '#0099cc', '#9933cc'];
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Random position
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    
    // Random animation delay
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    
    document.body.appendChild(confetti);
    
    // Remove after animation
    setTimeout(() => confetti.remove(), 3500);
  }
}

function generateRoastMessage(totalIncome, totalExpenses, expenses) {
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const applicableRoasts = [];
  
  // Category-specific roasts
  const categoryRoasts = {
    House: [
      "Your rent is eating your paycheck! 🏠💔",
      "That house payment... is that a mansion? 🏰",
      "Did you buy the whole neighborhood? 🏘️",
      "Your landlord thanks you for the donation! 💸",
    ],
    Car: [
      "That car payment could fund a vacation! 🚗",
      "Your car is more expensive than your savings! 🚙",
      "Fancy car, empty bank account 😅",
      "Is that a sports car or a savings killer? 🏎️",
    ],
    Food: [
      "Eating like you've never seen food before! 🍔",
      "That's... a lot of takeout, huh? 🍕",
      "Your grocery bill is insane! 🛒",
      "Are you feeding the neighborhood? 🍜",
      "Michelin star restaurants called, they say hi 🍽️",
    ],
    Utilities: [
      "Your electricity bill is astronomical! 💡",
      "That's not a utility bill, that's a mortgage! 🔌",
      "Did you leave all the lights on? 🌟",
    ],
    Healthcare: [
      "That healthcare budget is... extensive 🏥",
      "Living that premium wellness life! 💊",
      "You're basically funding the hospital! 🩺",
    ],
    Leisure: [
      "Your fun budget is bigger than your savings! 🎉",
      "Living your best life... on credit! 🎪",
      "All work and all play, no saving! 🎮",
      "Party budget > Retirement budget 🎊",
    ],
    Subscriptions: [
      "How many streaming services do you have?! 📺",
      "Subscription addiction detected! 📱",
      "You're basically funding Netflix's salary! 🎬",
      "That's a lot of monthly charges! 💳",
    ],
    Phone: [
      "That phone bill is... premium 📞",
      "Is your phone made of gold? 📱",
      "Your phone plan costs more than food? ☎️",
    ],
    Insurance: [
      "Insurance is important but... wow! 🛡️",
      "That's a lot of protection money! 🚨",
      "Insurance company loves you! 💰",
    ],
    Other: [
      "That 'Other' category is suspiciously high 🤔",
      "What's hiding in 'Other'? 🎁",
      "The miscellaneous money pit! 🕳️",
    ],
  };
  
  // Find the highest expense category
  let highestCategory = '';
  let highestAmount = 0;
  
  for (const [category, amount] of Object.entries(expenses)) {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount > highestAmount) {
      highestAmount = numAmount;
      highestCategory = category;
    }
  }
  
  // Prioritize category-specific roasts first (more fun variety)
  if (highestCategory && categoryRoasts[highestCategory]) {
    const categoryRatio = (highestAmount / totalIncome) * 100;
    
    if (categoryRatio > 25) {
      // Add all category roasts to applicable pool
      applicableRoasts.push(...categoryRoasts[highestCategory]);
    }
  }
  
  // Only show extreme overall spending roasts if REALLY extreme (95%+)
  if (expenseRatio > 95) {
    applicableRoasts.push("You're spending 95%+ of income! The credit card is MELTING! 🔥🔥🔥");
  } else if (expenseRatio > 85) {
    applicableRoasts.push("85%+ going to expenses? That's financial self-sabotage! 💥");
  } else if (expenseRatio > 75) {
    applicableRoasts.push("75%+ on expenses? Your wallet filed for bankruptcy! 😭");
  }
  
  // Generic roasts for general overspending
  const genericRoasts = [
    "Your spending is... impressive 💸",
    "That's a lot of money leaving your account! 💨",
    "Your priorities are... interesting 🤔",
    "Big spender energy detected! 💪",
    "That expense report is concerning 📊",
    "Your budget: adventure mode 🎢",
  ];
  
  if (expenseRatio > 50 && applicableRoasts.length === 0) {
    applicableRoasts.push(...genericRoasts);
  }
  
  // Return array of all applicable roasts
  return applicableRoasts.length > 0 ? applicableRoasts : [];
}

export function useRetirementRoasts(currentAge, retirementAge, monthlyInvestment, annualReturn, projectedBalance, goalBalance) {
  const { roastMode } = useSecretModes();

  if (!roastMode) return [];
  
  return generateRetirementRoast(currentAge, retirementAge, monthlyInvestment, annualReturn, projectedBalance, goalBalance);
}

function generateRetirementRoast(currentAge, retirementAge, monthlyInvestment, annualReturn, projectedBalance, goalBalance) {
  if (!currentAge || !retirementAge) return [];

  const applicableRoasts = [];
  const yearsToRetirement = retirementAge - currentAge;
  
  // Investment amount roasts
  if (monthlyInvestment < 100 && monthlyInvestment > 0) {
    const tooLowRoasts = [
      "Your monthly investment is... optimistic 💭",
      "That's a very cautious approach to retirement 🐢",
      "Investing $" + monthlyInvestment + "/month? That's... dedicated! 😅",
      "Your future self might want more than this 👴",
      "Small steps to retirement, I guess? 🚶",
    ];
    applicableRoasts.push(...tooLowRoasts);
  }

  if (monthlyInvestment < 500 && monthlyInvestment >= 100) {
    const modestRoasts = [
      "That monthly investment is... modest 🤔",
      "Slow and steady wins the race? 🐢",
      "Your retirement plan: procrastination edition 📅",
      "Hope compound interest is feeling generous! 📈",
      "That's one way to approach retirement 💭",
    ];
    applicableRoasts.push(...modestRoasts);
  }

  if (monthlyInvestment >= 5000) {
    const impressiveRoasts = [
      "Wow, serious retirement ambitions! 🚀",
      "That monthly investment is... aggressive 💪",
      "Your future self is THRIVING 💎",
      "Someone's taking retirement seriously! 📊",
      "Living for retirement? Bold choice 🎯",
    ];
    applicableRoasts.push(...impressiveRoasts);
  }

  // Years to retirement roasts
  if (yearsToRetirement < 5 && yearsToRetirement > 0) {
    const soonRoasts = [
      "Only " + yearsToRetirement + " years? Better invest BIG! 🏃",
      "That's cutting it close for retirement 😰",
      "Your time frame: panic mode activated 🚨",
      "Retirement is RIGHT THERE 👀",
      "Talk about last-minute planning! ⏰",
    ];
    applicableRoasts.push(...soonRoasts);
  }

  if (yearsToRetirement > 40) {
    const lottaTimeRoasts = [
      "You've got like... forever to invest 🌅",
      "That's a LOT of time before retirement 😌",
      "Early start = lazy investing allowed 🛋️",
      "So much time, so little urgency 😴",
      "Retirement seems far away, right? 🗓️",
    ];
    applicableRoasts.push(...lottaTimeRoasts);
  }

  // Return rate roasts
  if (annualReturn < 2) {
    const lowReturnRoasts = [
      "A " + annualReturn + "% annual return? That's... conservative 😴",
      "Your investment strategy: savings account energy 🏦",
      "Hope inflation doesn't catch up 📉",
      "That's being VERY cautious with returns 🤐",
    ];
    applicableRoasts.push(...lowReturnRoasts);
  }

  if (annualReturn > 15) {
    const highReturnRoasts = [
      "Expecting " + annualReturn + "% returns? That's... optimistic 📈",
      "Those returns are pretty aggressive 🎲",
      "Feeling lucky with your investments? 🍀",
      "That return rate is... ambitious 🎯",
    ];
    applicableRoasts.push(...highReturnRoasts);
  }

  // Projection vs goal roasts
  if (goalBalance && projectedBalance) {
    const ratio = (projectedBalance / goalBalance) * 100;
    if (ratio < 50) {
      applicableRoasts.push("Your projected balance is only " + ratio.toFixed(0) + "% of your goal 😬");
    } else if (ratio > 150) {
      applicableRoasts.push("Wow, you're crushing your retirement goal! 🏆");
    }
  }

  // Generic retirement roasts - only add if no specific roasts apply
  if (applicableRoasts.length === 0) {
    const genericRetirementRoasts = [
      "Thinking about retirement, are we? 🏖️",
      "Your retirement plan is... a plan! 📋",
      "Let's hope this actually works out 🤞",
      "Retirement: a mystery wrapped in math 🧮",
      "Your future awaits! (Hopefully) ⏳",
    ];
    applicableRoasts.push(...genericRetirementRoasts);
  }

  return applicableRoasts;
}

export function useOverviewRoasts(totalIncome, totalExpenses, savingsAmount, projectedRetirementBalance) {
  const { roastMode } = useSecretModes();

  if (!roastMode) return [];
  
  return generateOverviewRoast(totalIncome, totalExpenses, savingsAmount, projectedRetirementBalance);
}

function generateOverviewRoast(totalIncome, totalExpenses, savingsAmount, projectedRetirementBalance) {
  if (!totalIncome) return [];

  const applicableRoasts = [];
  const expenseRatio = (totalExpenses / totalIncome) * 100;
  const savingsRate = (savingsAmount / totalIncome) * 100;
  
  // Savings rate roasts
  if (savingsRate > 50) {
    const superSaverRoasts = [
      "Saving " + savingsRate.toFixed(0) + "% of income? You're a ROBOT 🤖",
      "That savings rate is LEGENDARY 🏆",
      "Are you actually spending money on living? 🤔",
      "Your future self is THANKING you 🙏",
    ];
    applicableRoasts.push(...superSaverRoasts);
  }

  if (savingsRate < 5) {
    const poorSaverRoasts = [
      "Saving only " + savingsRate.toFixed(1) + "%? That's... ambitious 😅",
      "Your savings rate is basically zero 📉",
      "Spending NOW, paying LATER? 💳",
      "What's a savings rate anyway? 🤷",
      "Your future self has some words for you 😬",
    ];
    applicableRoasts.push(...poorSaverRoasts);
  }

  // Overall financial health roasts
  if (totalExpenses > totalIncome) {
    const overspendingRoasts = [
      "You're SPENDING more than you EARN 😱",
      "Going into debt is your financial strategy? 💔",
      "That budget math doesn't add up! 🧮",
      "Deficit spending: is it a lifestyle? 💸",
    ];
    applicableRoasts.push(...overspendingRoasts);
  }

  // Retirement projection roasts
  if (projectedRetirementBalance) {
    if (projectedRetirementBalance < 100000) {
      applicableRoasts.push("Your retirement projection: under $100k? 😰 That's... tight.");
    } else if (projectedRetirementBalance > 1000000) {
      applicableRoasts.push("WHOA, over $1M projected at retirement?! 💰 Living the dream!");
    }
  }

  // Balanced overview roasts - only add if no specific roasts apply
  if (applicableRoasts.length === 0) {
    const overviewRoasts = [
      "Your financial overview is... a journey 📊",
      "Overall: could be worse, could be better 🤷",
      "This overview summarizes the chaos 😅",
      "Here's a snapshot of your money situation 📸",
      "Your finances: complicated but interesting 🎪",
    ];
    applicableRoasts.push(...overviewRoasts);
  }

  return applicableRoasts;
}
