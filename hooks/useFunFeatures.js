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
    roastMessage: roastMode ? generateRoastMessage(totalIncome, totalExpenses, expenses) : null,
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
      // Show category roast for notably high categories
      const roasts = categoryRoasts[highestCategory];
      return roasts[Math.floor(Math.random() * roasts.length)];
    }
  }
  
  // Only show extreme overall spending roasts if REALLY extreme (95%+)
  if (expenseRatio > 95) {
    return "You're spending 95%+ of income! The credit card is MELTING! 🔥🔥🔥";
  } else if (expenseRatio > 85) {
    return "85%+ going to expenses? That's financial self-sabotage! 💥";
  } else if (expenseRatio > 75) {
    return "75%+ on expenses? Your wallet filed for bankruptcy! 😭";
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
  
  if (expenseRatio > 50) {
    return genericRoasts[Math.floor(Math.random() * genericRoasts.length)];
  }
  
  return null;
}
