/**
 * Backward Compatibility
 * Currency Context has been consolidated into UserPreferencesContext
 * This file now re-exports the useCurrency hook for backward compatibility
 */

export { useCurrency } from './UserPreferencesContext';
