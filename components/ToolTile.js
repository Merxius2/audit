/**
 * Tool Tile Component - Landing page tool card
 */

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function ToolTile({ href, icon: Icon, titleKey, idx, tint }) {
  const { t } = useLanguage();
  const tintMap = {
    tint:   { bg: 'bg-tint-soft',   fg: 'text-[#2A45CC]' },
    violet: { bg: 'bg-violet-soft', fg: 'text-[#4F3FA0]' },
    mint:   { bg: 'bg-mint-soft',   fg: 'text-[#1F8E6E]' },
    amber:  { bg: 'bg-amber-soft',  fg: 'text-[#8B5E20]' },
    coral:  { bg: 'bg-coral-soft',  fg: 'text-[#A8302A]' },
  };
  const c = tintMap[tint] || tintMap.tint;

  return (
    <Link href={href}>
      <div className="spring glass rounded-md p-4 cursor-pointer h-full">
        <div className="flex items-center justify-between mb-10">
          <span className={`inline-flex w-9 h-9 items-center justify-center rounded-full ${c.bg} ${c.fg}`}>
            <Icon size={17} />
          </span>
          <span className="text-[10px] mono text-ink-faint">{idx}</span>
        </div>
        <p className="text-[14px] font-semibold tracking-tight">{t(titleKey)}</p>
      </div>
    </Link>
  );
}
