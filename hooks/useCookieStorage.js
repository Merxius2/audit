import { useState, useEffect } from 'react';
import { loadFromCookie, saveToCookie } from './cookieStorage';
import { useDebouncedCookie } from './useDebouncedCookie';

/**
 * Centralized cookie storage hook
 * Eliminates repetitive cookie loading/saving boilerplate across pages
 * 
 * @param {string} cookieKey - Cookie key to persist data under (e.g., 'AUDIT_DASHBOARD_DATA')
 * @param {object} initialData - Initial data structure if no cookie exists
 * @param {number} debounceDelay - Debounce delay for saves (ms), default 1000
 * @returns {object} { data, isLoading, updateData } - Data, loading state, and update function
 * 
 * @example
 * const { data, isLoading, updateData } = useCookieStorage('AUDIT_DASHBOARD_DATA', {
 *   incomes: [],
 *   expenses: {}
 * });
 * 
 * // Update a field
 * updateData('incomes', [...data.incomes, newIncome]);
 * 
 * // Or replace entire data
 * updateData(null, completeNewData);
 */
export function useCookieStorage(cookieKey, initialData = {}, debounceDelay = 1000) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);

  // Load from cookie on mount
  useEffect(() => {
    const savedData = loadFromCookie(cookieKey);
    if (savedData) {
      setData((prevData) => ({ ...prevData, ...savedData }));
    }
    setIsLoading(false);
  }, [cookieKey]);

  // Set up debounced save
  const debouncedSave = useDebouncedCookie(cookieKey, data, 30, debounceDelay);

  // Save whenever data changes
  useEffect(() => {
    if (!isLoading) {
      debouncedSave();
    }
  }, [data, isLoading, debouncedSave]);

  /**
   * Update a field in the data or replace entire data
   * @param {string|null} field - Field to update, or null to replace entire data
   * @param {any} value - New value for field or entire data object
   */
  const updateData = (field, value) => {
    if (field === null) {
      // Replace entire data
      setData(value);
    } else {
      // Update single field
      setData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
  };

  return {
    data,
    isLoading,
    updateData,
  };
}
