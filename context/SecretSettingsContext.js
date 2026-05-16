/**
 * Backward Compatibility
 * Secret Settings Context has been consolidated into FeatureContext
 * This file now re-exports the useSecretSettings hook for backward compatibility
 */

export { useSecretSettings } from './FeatureContext';
