/**
 * Settings Page
 * Manage application settings and data
 */

import { useState } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { deleteCookie } from '../lib/cookieStorage';
import { useRouter } from 'next/router';

export default function SettingsPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const router = useRouter();

  const handleResetData = () => {
    setShowConfirmation(true);
  };

  const confirmReset = () => {
    try {
      deleteCookie('huishoudboekje_data');
      deleteCookie('retirement_data');
      setResetMessage('All data has been cleared successfully!');
      setShowConfirmation(false);
      
      // Refresh the page after 1.5 seconds
      setTimeout(() => {
        router.reload();
      }, 1500);
    } catch (error) {
      setResetMessage('Error clearing data. Please try again.');
    }
  };

  const cancelReset = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-white pb-32 md:ml-64 md:pb-0">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Settings size={36} className="text-brand-primary" />
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Settings</h1>
          </div>
          <p className="text-gray-600">Manage your application settings and data</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 px-4 py-8 md:px-8">
        {/* Reset Data Section */}
        <div className="card p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset All Data</h2>
              <p className="text-gray-600 mb-6">
                Clear all your financial data from the application. This action cannot be undone.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This will delete all data including income, expenses, savings, and retirement projections.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleResetData}
            className="inline-flex items-center space-x-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-all hover:bg-red-700 active:scale-95"
          >
            <Trash2 size={20} />
            <span>Clear All Data</span>
          </button>

          {/* Success Message */}
          {resetMessage && (
            <div className={`mt-6 rounded-lg p-4 ${resetMessage.includes('successfully') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              <p className="font-medium">{resetMessage}</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card p-8 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Data Reset</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all your financial data? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelReset}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-all hover:bg-red-700"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
