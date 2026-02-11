
import React from 'react';
import { MuhurtaDetail, Language } from '../types';

interface Props {
  data: MuhurtaDetail;
  language: Language;
}

const translations = {
  [Language.ENGLISH]: {
    scoreSuffix: '% Auspicious',
    tithi: 'Tithi',
    nakshatra: 'Nakshatra',
    yoga: 'Yoga'
  },
  [Language.KANNADA]: {
    scoreSuffix: '% ಶುಭ',
    tithi: 'ತಿಥಿ',
    nakshatra: 'ನಕ್ಷತ್ರ',
    yoga: 'ಯೋಗ'
  },
  [Language.HINDI]: {
    scoreSuffix: '% शुभ',
    tithi: 'तिथि',
    nakshatra: 'नक्षत्र',
    yoga: 'योग'
  }
};

const MuhurtaCard: React.FC<Props> = ({ data, language }) => {
  const t = translations[language];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (score >= 75) return 'bg-blue-100 text-blue-900 border-blue-300';
    return 'bg-orange-100 text-orange-900 border-orange-300';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const locale = language === Language.KANNADA ? 'kn-IN' : (language === Language.HINDI ? 'hi-IN' : 'en-US');
    
    return date.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="muhurta-card bg-white border border-stone-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full ring-1 ring-orange-50/50 print:shadow-none print:border-stone-400 print:break-inside-avoid" lang={language}>
      <div className="flex flex-col mb-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-xl font-bold text-stone-900 tracking-tight leading-tight">{formatDate(data.date)}</h3>
          <div className={`px-2 py-1 rounded-lg text-xs font-black border ${getScoreColor(data.auspiciousScore)} whitespace-nowrap shadow-sm print:bg-stone-50 print:text-black`}>
            {data.auspiciousScore}{t.scoreSuffix}
          </div>
        </div>
        <p className="text-sm text-orange-800 font-bold opacity-90">{data.day} • {data.timeRange}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 print:border-stone-300 overflow-hidden">
          <span className="block text-stone-400 text-[9px] uppercase tracking-widest font-black mb-0.5">{t.tithi}</span>
          <span className="text-sm text-stone-800 font-bold block truncate">{data.tithi}</span>
        </div>
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 print:border-stone-300 overflow-hidden">
          <span className="block text-stone-400 text-[9px] uppercase tracking-widest font-black mb-0.5">{t.nakshatra}</span>
          <span className="text-sm text-stone-800 font-bold block truncate">{data.nakshatra}</span>
        </div>
      </div>

      <div className="flex-grow">
        <p className="text-xs md:text-sm text-stone-700 leading-relaxed font-medium bg-orange-50/20 p-4 rounded-xl border border-orange-100/50 italic print:bg-white print:border-stone-200 break-words">
          "{data.description}"
        </p>
      </div>

      {data.yoga && (
        <div className="mt-4 pt-3 border-t border-dashed border-stone-100">
          <p className="text-[10px] text-stone-500 font-bold flex items-center overflow-hidden">
            <span className="text-stone-400 uppercase tracking-widest mr-2 text-[8px] font-black shrink-0">{t.yoga}</span> 
            <span className="text-stone-800 truncate">{data.yoga}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default MuhurtaCard;
