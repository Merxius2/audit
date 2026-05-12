import { X, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/router';
import { useSecretSettings } from '../context/SecretSettingsContext';
import { useSecretModes } from '../context/SecretModesContext';
import { deleteCookie } from '../lib/cookieStorage';

export default function SecretSettingsModal() {
  const router = useRouter();
  const { isSecretSettingsOpen, closeSecretSettings } = useSecretSettings();
  const { confettiMode, darkSoulMode, roastMode, achievementMode, toggleConfetti, toggleDarkSoul, toggleRoast, toggleAchievement } = useSecretModes();

  const handleResetAchievements = () => {
    deleteCookie('unlocked_achievements');
    deleteCookie('data_reset_count');
    alert('🏆 All achievements have been reset!');
    router.push(router.asPath);
  };

  if (!isSecretSettingsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="card bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-purple-400 p-8 max-w-md mx-auto rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-purple-300">🔐 Secret Settings</h2>
          <button
            onClick={closeSecretSettings}
            className="text-purple-300 hover:text-purple-100 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Confetti Mode */}
          <div className="bg-purple-800/50 border border-purple-400 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-semibold mb-1">🎉 Confetti Mode</p>
              <p className="text-purple-200 text-xs">Celebrate savings goals with confetti!</p>
            </div>
            <button
              onClick={toggleConfetti}
              className={`relative flex-shrink-0 h-6 w-11 items-center rounded-full transition-colors inline-flex ${
                confettiMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  confettiMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Dark Soul Mode */}
          <div className="bg-indigo-800/50 border border-indigo-400 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-semibold mb-1">🌑 Dark Soul Mode</p>
              <p className="text-indigo-200 text-xs">Embrace the dramatic darkness...</p>
            </div>
            <button
              onClick={toggleDarkSoul}
              className={`relative flex-shrink-0 h-6 w-11 items-center rounded-full transition-colors inline-flex ${
                darkSoulMode
                  ? 'bg-gradient-to-r from-red-700 to-black'
                  : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  darkSoulMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Roast Mode */}
          <div className="bg-orange-800/50 border border-orange-400 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-semibold mb-1">🔥 Roast Mode</p>
              <p className="text-orange-200 text-xs">Get critiqued on your spending habits</p>
            </div>
            <button
              onClick={toggleRoast}
              className={`relative flex-shrink-0 h-6 w-11 items-center rounded-full transition-colors inline-flex ${
                roastMode
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  roastMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Achievement Mode */}
          <div className="bg-yellow-800/50 border border-yellow-400 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-semibold mb-1">🏆 Achievement Mode</p>
              <p className="text-yellow-200 text-xs">Unlock badges for financial milestones</p>
            </div>
            <button
              onClick={toggleAchievement}
              className={`relative flex-shrink-0 h-6 w-11 items-center rounded-full transition-colors inline-flex ${
                achievementMode
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  achievementMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={handleResetAchievements}
          className="w-full mb-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Reset All Achievements
        </button>

        <button
          onClick={closeSecretSettings}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
        >
          Close Secret Settings
        </button>
      </div>
    </div>
  );
}
