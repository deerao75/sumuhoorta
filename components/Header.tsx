
import React from 'react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const translations = {
  [Language.ENGLISH]: {
    title: 'Sumuhoorta',
    subtitle: 'Discover celestial alignments for your auspicious milestones'
  },
  [Language.KANNADA]: {
    title: 'ಸುಮುಹೂರ್ತ',
    subtitle: 'ನಿಮ್ಮ ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಶುಭ ಮುಹೂರ್ತ'
  },
  [Language.HINDI]: {
    title: 'सुमुहूर्त',
    subtitle: 'अपने शुभ कार्यों के लिए स्वर्गीय तालमेल की खोज करें'
  }
};

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const t = translations[language];

  return (
    <header className="bg-white border-b border-orange-100 py-8 px-4 relative overflow-hidden no-print">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-50 rounded-full translate-x-1/2 translate-y-1/2 opacity-20 blur-3xl"></div>

      <div className="max-w-5xl mx-auto text-center z-10 relative">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
          
          {/* Focused Celestial Clock Logo */}
          <div className="relative w-24 h-24 md:w-28 md:h-28 group">
            <svg 
              className="w-full h-full drop-shadow-2xl transition-all duration-700" 
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="clockPlate" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff7ed" />
                  <stop offset="100%" stopColor="#ffedd5" />
                </linearGradient>
                <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Main Outer Rim */}
              <circle cx="50" cy="50" r="45" fill="url(#goldRim)" />
              <circle cx="50" cy="50" r="41" fill="url(#clockPlate)" stroke="#f59e0b" strokeWidth="0.5" />

              {/* Decorative Inner Ring with Markers */}
              <circle cx="50" cy="50" r="34" fill="none" stroke="#fed7aa" strokeWidth="1" strokeDasharray="2 4" />
              
              {/* Hour Markers */}
              {[0, 90, 180, 270].map((angle) => (
                <rect 
                  key={angle}
                  x="48.5" y="12" width="3" height="8" rx="1.5" fill="#92400e"
                  transform={`rotate(${angle} 50 50)`}
                />
              ))}

              {/* Celestial Clock Hands */}
              <g>
                <line x1="50" y1="50" x2="50" y2="28" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round">
                  <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    from="0 50 50" to="360 50 50" 
                    dur="120s" repeatCount="indefinite" 
                  />
                </line>
                <circle cx="50" cy="28" r="2.5" fill="#7c2d12">
                   <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    from="0 50 50" to="360 50 50" 
                    dur="120s" repeatCount="indefinite" 
                  />
                </circle>
              </g>

              {/* Minute Hand (Medium) */}
              <g>
                <line x1="50" y1="50" x2="50" y2="18" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round">
                  <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    from="0 50 50" to="360 50 50" 
                    dur="20s" repeatCount="indefinite" 
                  />
                </line>
                <circle cx="50" cy="18" r="1.5" fill="#d97706">
                  <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    from="0 50 50" to="360 50 50" 
                    dur="20s" repeatCount="indefinite" 
                  />
                </circle>
              </g>

              {/* "Sun" Center Pivot */}
              <circle cx="50" cy="50" r="6" fill="#f59e0b" filter="url(#softGlow)" />
              <circle cx="50" cy="50" r="3" fill="#92400e" />

              {/* Small Wandering Planet */}
              <circle r="2" fill="#ea580c">
                <animateMotion 
                  path="M 50,50 m -38,0 a 38,38 0 1,0 76,0 a 38,38 0 1,0 -76,0" 
                  dur="15s" repeatCount="indefinite" 
                />
              </circle>
            </svg>
          </div>

          <h1 className="font-cinzel text-5xl md:text-6xl font-bold text-orange-900 tracking-tight drop-shadow-sm">
            {t.title}
          </h1>
        </div>
        
        <p className="text-orange-700 text-xl md:text-2xl font-light italic opacity-90 max-w-2xl mx-auto leading-tight mb-8">
          {t.subtitle}
        </p>

        <div className="flex justify-center items-center space-x-3 mb-6">
          <span className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-orange-200"></span>
          <div className="flex space-x-2">
            <span className="h-1.5 w-1.5 bg-orange-400 rounded-full"></span>
            <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full"></span>
            <span className="h-1.5 w-1.5 bg-orange-400 rounded-full"></span>
          </div>
          <span className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-orange-200"></span>
        </div>

        {/* Language Selector Integrated Below the line */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onLanguageChange(Language.ENGLISH)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              language === Language.ENGLISH ? 'bg-orange-600 text-white shadow-md' : 'text-stone-500 hover:text-orange-600 bg-stone-50'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange(Language.KANNADA)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              language === Language.KANNADA ? 'bg-orange-600 text-white shadow-md' : 'text-stone-500 hover:text-orange-600 bg-stone-50'
            }`}
          >
            ಕನ್ನಡ
          </button>
          <button
            onClick={() => onLanguageChange(Language.HINDI)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              language === Language.HINDI ? 'bg-orange-600 text-white shadow-md' : 'text-stone-500 hover:text-orange-600 bg-stone-50'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
