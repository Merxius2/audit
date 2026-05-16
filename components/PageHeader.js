/**
 * PageHeader — large inline display title for each screen.
 *
 * Adds the small numbered eyebrow ("Audit · 01" / "Calculator · 04" / "Setup")
 * above the heading, matching the mockup. The eyebrow is auto-derived from
 * `titleKey` so the existing pages don't need to pass anything new.
 */

import { useLanguage } from '../context/LanguageContext';

// titleKey → small label that sits above the heading
const EYEBROW = {
  'overview.title':   'Audit · 01',
  'dashboard.title':  'Audit · 02',
  'retirement.title': 'Audit · 03',
  'debt.title':       'Calculator · 04',
  'tax.title':        'Calculator · 05',
  'settings.title':   'Setup',
};

export default function PageHeader({ icon: IconComponent, titleKey, eyebrow }) {
  const { t } = useLanguage();
  const label = eyebrow || EYEBROW[titleKey];

  return (
    <div className="px-4 md:px-8 pt-5 md:pt-7 pb-2 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        {IconComponent && (
          <span className="inline-flex w-9 h-9 items-center justify-center rounded-full glass">
            <IconComponent size={18} className="text-[#2A45CC]" />
          </span>
        )}
        <h1 className="display-2 text-[32px] md:text-[40px] text-ink dark:text-[#FAFAFA]">
          {t(titleKey)}
        </h1>
      </div>
    </div>
  );
}
