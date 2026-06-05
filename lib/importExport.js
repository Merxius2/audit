/**
 * Import/Export Utilities
 * Handles compression, encoding, checksums for data serialization
 */

// Simple CRC32 implementation for data validation
const CRC32_TABLE = (() => {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

const crc32 = (str) => {
  let crc = 0 ^ -1;
  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ str.charCodeAt(i)) & 0xff];
  }
  return ((crc ^ -1) >>> 0).toString(16).padStart(8, '0');
};

// Key mapping for compact data storage
const KEY_MAP = {
  // Dashboard keys
  calculationType: 'ct',
  person1Income: 'p1i',
  person1Expenses: 'p1e',
  person2Income: 'p2i',
  person2Expenses: 'p2e',
  sharedExpenses: 'se',
  // Retirement keys
  currentAge: 'ca',
  retirementAge: 'ra',
  monthlyInvestment: 'mi',
  annualReturn: 'ar',
  goalBalance: 'gb',
  currentBalance: 'cb',
};

const REVERSE_KEY_MAP = Object.entries(KEY_MAP).reduce((acc, [k, v]) => {
  acc[v] = k;
  return acc;
}, {});

/**
 * Generate compressed export string with checksum
 * @param {Object} dashboardData - Dashboard cookie data
 * @param {Object} retirementData - Retirement cookie data
 * @returns {string} Compressed, encoded string with checksum
 */
export const generateExportString = (dashboardData, retirementData) => {
  try {
    // Compress keys
    const compressed = {
      d: compressObject(dashboardData || {}),
      r: compressObject(retirementData || {}),
    };

    // Encode to Base64 (browser-compatible)
    const jsonStr = JSON.stringify(compressed);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));

    // Append checksum
    const checksum = crc32(encoded);
    return `${encoded}:${checksum}`;
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to generate export string');
  }
};

/**
 * Parse and validate import string
 * @param {string} str - Export string to parse
 * @returns {Object} { dashboardData, retirementData } or null if invalid
 */
export const parseImportString = (str) => {
  try {
    if (!str || typeof str !== 'string') {
      throw new Error('Invalid input');
    }

    const parts = str.trim().split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid format');
    }

    const [encoded, checksum] = parts;

    // Validate checksum
    const expectedChecksum = crc32(encoded);
    if (expectedChecksum !== checksum.toLowerCase()) {
      throw new Error('Checksum validation failed');
    }

    // Decode from Base64 (browser-compatible)
    const decoded = decodeURIComponent(escape(atob(encoded)));

    const compressed = JSON.parse(decoded);

    return {
      dashboardData: decompressObject(compressed.d || {}),
      retirementData: decompressObject(compressed.r || {}),
    };
  } catch (error) {
    console.error('Import error:', error);
    throw new Error(`Import failed: ${error.message}`);
  }
};

/**
 * Compress object keys for smaller payload
 */
const compressObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const compressed = {};
  for (const [key, value] of Object.entries(obj)) {
    const shortKey = KEY_MAP[key] || key;
    compressed[shortKey] = value;
  }
  return compressed;
};

/**
 * Decompress object keys back to full names
 */
const decompressObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const decompressed = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = REVERSE_KEY_MAP[key] || key;
    decompressed[fullKey] = value;
  }
  return decompressed;
};
