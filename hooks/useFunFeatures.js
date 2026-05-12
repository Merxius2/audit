import { useEffect } from 'react';
import { useSecretModes } from '../context/SecretModesContext';

export function useFunFeatures(totalIncome, totalExpenses) {
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
    getRoastMessage: roastMode ? generateRoastMessage(totalIncome, totalExpenses) : null,
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

function generateRoastMessage(totalIncome, totalExpenses) {
  const expenseRatio = (totalExpenses / totalIncome) * 100;
  
  const roasts = [
    "You spent HOW much on coffee?! ☕",
    "That's a lot of money flying out the window 💨",
    "Your spending is... creative 😬",
    "Big spender energy detected 💸",
    "Yikes. Let's talk about your priorities 📊",
    "That expense category is... ambitious 🎯",
    "Did you really need all that? 🤔",
    "Your wallet called. It's lonely. 👛",
  ];
  
  if (expenseRatio > 90) {
    return "You're spending 90%+ of income! The credit card is getting hot! 🔥";
  } else if (expenseRatio > 80) {
    return "80%+ going to expenses? That's aggressive spending! 💥";
  } else if (expenseRatio > 70) {
    return "70%+ on expenses? Your wallet is crying! 😢";
  } else if (expenseRatio > 50) {
    return roasts[Math.floor(Math.random() * roasts.length)];
  }
  
  return null;
}
