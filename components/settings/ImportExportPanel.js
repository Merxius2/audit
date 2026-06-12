import { useState } from 'react';
import { Download, Upload, Copy, Check } from 'lucide-react';
import { loadFromCookie, saveToCookie } from '../../lib/cookieStorage';
import { generateExportString, parseImportString } from '../../lib/importExport';
import { useLanguage } from '../../context/UserPreferencesContext';
import ConfirmModal from '../ConfirmModal';
import ThemedIcon from '../ThemedIcon';

export default function ImportExportPanel() {
  const { t } = useLanguage();
  const [exportString, setExportString] = useState('');
  const [importString, setImportString] = useState('');
  const [importMessage, setImportMessage] = useState('');
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleExport = async () => {
    try {
      const dashboardData = loadFromCookie('AUDIT_DASHBOARD_DATA');
      const retirementData = loadFromCookie('AUDIT_RETIREMENT_DATA');
      setExportString(await generateExportString(dashboardData, retirementData));
      setImportMessage('');
    } catch (error) {
      setImportMessage(`Export error: ${error.message}`);
    }
  };

  const handleCopyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleImportClick = async () => {
    try {
      await parseImportString(importString);
      setShowImportConfirm(true);
      setImportMessage('');
    } catch (error) {
      setImportMessage(`${error.message}`);
    }
  };

  const confirmImport = async () => {
    try {
      const result = await parseImportString(importString);
      if (result.dashboardData && Object.keys(result.dashboardData).length > 0) {
        saveToCookie('AUDIT_DASHBOARD_DATA', result.dashboardData, 365);
      }
      if (result.retirementData && Object.keys(result.retirementData).length > 0) {
        saveToCookie('AUDIT_RETIREMENT_DATA', result.retirementData, 365);
      }
      setImportMessage(t('settings.importSuccess'));
      setImportString('');
      setShowImportConfirm(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setImportMessage(`Import error: ${error.message}`);
      setShowImportConfirm(false);
    }
  };

  const isErrorMessage = importMessage.includes('error') || importMessage.includes('failed')
    || importMessage.includes('Checksum') || importMessage.includes('Invalid');

  return (
    <>
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <ThemedIcon icon={Download} variant="section" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('settings.exportTitle')}</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t('settings.exportDesc')}</p>
        <button
          type="button"
          onClick={handleExport}
          className="mb-6 inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-6 py-3 font-semibold text-white transition-all hover:shadow-lg active:scale-95"
        >
          <Download size={20} />
          <span>{t('settings.exportButton')}</span>
        </button>
        {exportString && (
          <div className="space-y-3">
            <textarea
              value={exportString}
              readOnly
              className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:ring-0"
              rows={4}
            />
            <button
              type="button"
              onClick={() => handleCopyToClipboard(exportString, 'export')}
              className="inline-flex items-center space-x-2 rounded-lg border border-brand-primary bg-white dark:bg-gray-800 px-6 py-2 font-semibold text-brand-primary transition-all hover:bg-brand-primary hover:text-white"
            >
              {copiedIndex === 'export' ? <><Check size={18} /><span>{t('settings.copied')}</span></> : <><Copy size={18} /><span>{t('settings.copyButton')}</span></>}
            </button>
          </div>
        )}
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <ThemedIcon icon={Upload} variant="section" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('settings.importTitle')}</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t('settings.importDesc')}</p>
        <div className="space-y-3">
          <textarea
            value={importString}
            onChange={(e) => setImportString(e.target.value)}
            placeholder={t('settings.importPlaceholder')}
            className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            rows={4}
          />
          <button
            type="button"
            onClick={handleImportClick}
            disabled={!importString.trim()}
            className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-6 py-3 font-semibold text-white transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={20} />
            <span>{t('settings.importButton')}</span>
          </button>
          {importMessage && (
            <div className={`mt-4 rounded-lg p-4 ${
              isErrorMessage
                ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
            }`}>
              <p className="font-medium">{importMessage}</p>
            </div>
          )}
        </div>
      </div>

      {showImportConfirm && (
        <ConfirmModal
          title={t('settings.importConfirmTitle')}
          message={t('settings.importConfirmDesc')}
          confirmLabel={t('settings.importConfirm')}
          cancelLabel={t('settings.cancel')}
          onConfirm={confirmImport}
          onCancel={() => setShowImportConfirm(false)}
          confirmClassName="bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg"
        />
      )}
    </>
  );
}
