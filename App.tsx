import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MuhurtaCard from './components/MuhurtaCard';
import { 
  ActivityType, 
  MuhurtaRequest, 
  MuhurtaResponse, 
  RASHIS, 
  RASHIS_KN, 
  RASHIS_HI,
  NAKSHATRAS, 
  NAKSHATRAS_KN, 
  NAKSHATRAS_HI,
  PADA_OPTIONS, 
  PersonDetails, 
  Language, 
  ACTIVITY_TRANSLATIONS,
  SearchMode
} from './types';
import { findMuhurtas } from './services/geminiService';

const emptyPerson = (label: string): PersonDetails => ({
  birthDate: '',
  birthTime: '',
  birthPlace: '',
  rashi: RASHIS[0],
  nakshatra: NAKSHATRAS[0],
  nakshatraPada: 1,
  label
});

const translations = {
  [Language.ENGLISH]: {
    inquiryTitle: 'Divine Inquiry',
    inquiryDesc: 'Personalized Muhurta finding requires accurate birth details to calculate compatibility and celestial strength.',
    jointAnalysis: 'Joint Analysis Active',
    jointDetails: ['✓ Guna/Nakshatra compatibility scan', '✓ Shared auspicious windows', '✓ Nakshatra Pada precision'],
    methodologyTitle: 'Astrological Methodology',
    methodologyDesc: 'Based on Muhurta Shastra & Drik Ganitha (Precise Astronomical Calculations).',
    sec1Title: '1. Essential Details',
    activityLabel: 'Auspicious Activity',
    cityLabel: 'Event City',
    searchModeLabel: 'Search Mode',
    modeSpecific: 'Specific Date',
    modeRange: 'Date Range',
    startDateLabel: 'Start Date',
    endDateLabel: 'End Date (Max 6 months)',
    specificDateLabel: 'Event Date',
    sec2Title: '2. Birth Details',
    sec2TitleJoint: '2. Birth Details (Both Parties)',
    birthDetailsNote: 'Note: For a precise personalized Muhurta, please provide at least the Rashi and Janma Nakshatra details.',
    brideDetails: "Bride's Details",
    groomDetails: "Groom's Details",
    genericDetails: "Birth Details",
    dob: 'Date of Birth',
    tob: 'Time of Birth',
    pob: 'Place of Birth',
    rashiLabel: 'Rashi (Moon Sign)',
    nakLabel: 'Janma Nakshatra',
    padaLabel: 'Pada',
    calculateBtn: 'Calculate Auspicious Muhurtas',
    calculatingBtn: 'Analyzing Celestial Path...',
    insightsTitle: '✨ Personalized Astrological Insights',
    newSearch: 'New Search',
    savePrint: 'Print Report (PDF)',
    starsAwait: 'The celestial clock awaits your request.',
    errorRange: 'Date range cannot exceed 6 months.',
    errorFuture: 'End date must be after start date.',
    reportTitle: 'Auspicious Muhurta Analysis Report',
    inputSummary: 'Input Configuration & Personal Details',
    generatedOn: 'Report Generated On',
    disclaimer: 'Disclaimer: These results are generated algorithmically based on the specific inputs you provide. While Sumuhoorta uses advanced AI to simulate traditional Vedic Shastra, machines can make mistakes or overlook nuanced ritualistic requirements. This report is for guidance only; please consult a qualified priest or astrologer for final confirmation of major life events.'
  },
  [Language.KANNADA]: {
    inquiryTitle: 'ದೈವಿಕ ವಿಚಾರಣೆ',
    inquiryDesc: 'ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಮುಹೂರ್ತವನ್ನು ಕಂಡುಹಿಡಿಯಲು ಹೊಂದಾಣಿಕೆ ಮತ್ತು ಆಕಾಶ ಶಕ್ತಿಯನ್ನು ಲೆಕ್ಕಹಾಕಲು ನಿಖರವಾದ ಜನ್ಮ ವಿವರಗಳ ಅಗತ್ಯವಿದೆ.',
    jointAnalysis: 'ಜಂಟಿ ವಿಶ್ಲೇಷಣೆ ಸಕ್ರಿಯವಾಗಿದೆ',
    jointDetails: ['✓ ಗುಣ/ನಕ್ಷತ್ರ ಹೊಂದಾಣಿಕೆಯ ಸ್ಕ್ಯಾನ್', '✓ ಹಂಚಿಕೆಯ ಶುಭ ಸಮಯಗಳು', '✓ ನಕ್ಷತ್ರ ಪಾದದ ನಿಖರತೆ'],
    methodologyTitle: 'ಜ್ಯೋತಿಷ್ಯ ಪದ್ಧತಿ',
    methodologyDesc: 'ಮುಹೂರ್ತ ಶಾಸ್ತ್ರ ಮತ್ತು ದೃಕ್ ಗಣಿತ (ನಿಖರವಾದ ಖಗೋಳ ಲೆಕ್ಕಾಚಾರಗಳು) ಆಧರಿಸಿದೆ.',
    sec1Title: '1. ಅಗತ್ಯ ವಿವರಗಳು',
    activityLabel: 'ಶುಭ ಕಾರ್ಯ',
    cityLabel: 'ಕಾರ್ಯಕ್ರಮದ ನಗರ',
    searchModeLabel: 'ಹುಡುಕಾಟದ ವಿಧಾನ',
    modeSpecific: 'ನಿಖರವಾದ ದಿನಾಂಕ',
    modeRange: 'ದಿನಾಂಕ ಶ್ರೇಣಿ',
    startDateLabel: 'ಪ್ರಾರಂಭ ದಿನಾಂಕ',
    endDateLabel: 'ಮುಕ್ತಾಯ ದಿನಾಂಕ (ಗರಿಷ್ಠ 6 ತಿಂಗಳು)',
    specificDateLabel: 'ಕಾರ್ಯಕ್ರಮದ ದಿನಾಂಕ',
    sec2Title: '2. ಜನ್ಮ ವಿವರಗಳು',
    sec2TitleJoint: '2. ಜನ್ಮ ವಿವರಗಳು (ಇಬ್ಬರ ವಿವರಗಳು)',
    birthDetailsNote: 'ಸೂಚನೆ: ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ನಿಖರ ಮುಹೂರ್ತಕ್ಕಾಗಿ, ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ರಾಶಿ ಮತ್ತು ಜನ್ಮ ನಕ್ಷತ್ರದ ವಿವರಗಳನ್ನು ನೀಡಿ.',
    brideDetails: "ವಧುವಿನ ವಿವರಗಳು",
    groomDetails: "ವರನ ವಿವರಗಳು",
    genericDetails: "ಜನ್ಮ ವಿವರಗಳು",
    dob: 'ಜನ್ಮ ದಿನಾಂಕ',
    tob: 'ಜನ್ಮ ಸಮಯ',
    pob: 'ಜನ್ಮ ಸ್ಥಳ',
    rashiLabel: 'ರಾಶಿ',
    nakLabel: 'ಜನ್ಮ ನಕ್ಷತ್ರ',
    padaLabel: 'ಪಾದ',
    calculateBtn: 'ಶುಭ ಮುಹೂರ್ತಗಳನ್ನು ಲೆಕ್ಕಹಾಕಿ',
    calculatingBtn: 'ಗ್ರಹಗತಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    insightsTitle: '✨ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಜ್ಯೋತಿಷ್ಯ ಒಳನೋಟಗಳು',
    newSearch: 'ಹೊಸ ಹುಡುಕಾಟ',
    savePrint: 'ವರದಿ ಮುದ್ರಿಸಿ (PDF)',
    starsAwait: 'ಆಕಾಶದ ಗಡಿಯಾರ ನಿಮ್ಮ ವಿನಂತಿಗಾಗಿ ಕಾಯುತ್ತಿದೆ.',
    errorRange: 'ದಿನಾಂಕದ ವ್ಯಾಪ್ತಿ 6 ತಿಂಗಳನ್ನು ಮೀರಬಾರದು.',
    errorFuture: 'ಮುಕ್ತಾಯ ದಿನಾಂಕವು ಪ್ರಾರಂಭ ದಿನಾಂಕದ ನಂತರ ಇರಬೇಕು.',
    reportTitle: 'ಶುಭ ಮುಹೂರ್ತ ವಿಶ್ಲೇಷಣಾ ವರದಿ',
    inputSummary: 'ವಿವರಗಳ ಸಾರಾಂಶ',
    generatedOn: 'ವರದಿ ತಯಾರಾದ ಸಮಯ',
    disclaimer: 'ಹಕ್ಕುತ್ಯಾಗ: ನೀವು ಒದಗಿಸಿದ ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ ಈ ಫಲಿತಾಂಶಗಳನ್ನು ತಯಾರಿಸಲಾಗಿದೆ. ಸುಮುಹೂರ್ತವು ಲೆಕ್ಕಾಚಾರಕ್ಕಾಗಿ ಸುಧಾರಿತ AI ಮಾದರಿಗಳನ್ನು ಬಳಸುತ್ತದೆ, ಅವುಗಳು ಕೆಲವೊಮ್ಮೆ ತಪ್ಪುಗಳನ್ನು ಮಾಡಬಹುದು. ಅಂತಿಮ ನಿರ್ಧಾರಗಳಿಗಾಗಿ ದಯವಿಟ್ಟು ವೃತ್ತಿಪರ ಜ್ಯೋತಿಷಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ.'
  },
  [Language.HINDI]: {
    inquiryTitle: 'दिव्य पूछताछ',
    inquiryDesc: 'व्यक्तिगत मुहूर्त खोजने के लिए अनुकूलता और स्वर्गीय शक्ति की गणना हेतु सटीक जन्म विवरण की आवश्यकता होती है।',
    jointAnalysis: 'संयुक्त विश्लेषण सक्रिय',
    jointDetails: ['✓ गुण/नक्षत्र अनुकूलता स्कैन', '✓ साझा शुभ समय', '✓ नक्षत्र पद सटीकता'],
    methodologyTitle: 'ज्योतिष पद्धति',
    methodologyDesc: 'मुहूर्त शास्त्र और दृक गणित (सटीक खगोलीय गणना) पर आधारित।',
    sec1Title: '1. आवश्यक विवरण',
    activityLabel: 'शुभ कार्य',
    cityLabel: 'आयोजन शहर',
    searchModeLabel: 'खोज मोड',
    modeSpecific: 'विशिष्ट तिथि',
    modeRange: 'तिथि सीमा',
    startDateLabel: 'प्रारंभ तिथि',
    endDateLabel: 'समाप्ति तिथि (अधिकतम 6 महीने)',
    specificDateLabel: 'आयोजन तिथि',
    sec2Title: '2. जन्म विवरण',
    sec2TitleJoint: '2. जन्म विवरण (दोनों पक्ष)',
    birthDetailsNote: 'नोट: सटीक व्यक्तिगत मुहूर्त के लिए, कृपया कम से कम राशि और जन्म नक्षत्र का विवरण प्रदान करें।',
    brideDetails: "वधू का विवरण",
    groomDetails: "वर का विवरण",
    genericDetails: "जन्म विवरण",
    dob: 'जन्म तिथि',
    tob: 'जन्म समय',
    pob: 'जन्म स्थान',
    rashiLabel: 'राशि',
    nakLabel: 'जन्म नक्षत्र',
    padaLabel: 'पद',
    calculateBtn: 'शुभ मुहूर्त की गणना करें',
    calculatingBtn: 'ग्रहों की गति का विश्लेषण...',
    insightsTitle: '✨ व्यक्तिगत ज्योतिषीय अंतर्दृष्टि',
    newSearch: 'नई खोज',
    savePrint: 'रिपोर्ट प्रिंट करें (PDF)',
    starsAwait: 'आकाशीय घड़ी आपके अनुरोध की प्रतीक्षा कर रही है।',
    errorRange: 'तिथि सीमा 6 महीने से अधिक नहीं हो सकती।',
    errorFuture: 'समाप्ति तिथि प्रारंभ तिथि के बाद होनी चाहिए.',
    reportTitle: 'शुभ मुहूर्त विश्लेषण रिपोर्ट',
    inputSummary: 'इनपुट और व्यक्तिगत विवरण सारांश',
    generatedOn: 'रिपोर्ट जनरेट होने का समय',
    disclaimer: 'अस्वीकरण: ये परिणाम आपके द्वारा प्रदान किए गए इनपुट के आधार पर तैयार किए गए हैं। सुमुहूर्त उन्नत एआई मॉडल का उपयोग करता है, जो कभी-कभी गलतियाँ कर सकते हैं। अंतिम निर्णयों के लिए कृपया किसी पेशेवर ज्योतिषी से परामर्श लें।'
  }
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MuhurtaResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<MuhurtaRequest | null>(null);
  
  const [activity, setActivity] = useState<ActivityType>(ActivityType.MARRIAGE);
  const [location, setLocation] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('range');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  });
  
  const [person1, setPerson1] = useState<PersonDetails>(emptyPerson('Person'));
  const [person2, setPerson2] = useState<PersonDetails>(emptyPerson('Partner'));

  const isJointActivity = activity === ActivityType.MARRIAGE || activity === ActivityType.ENGAGEMENT;
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || 'your area';
            setLocation(city);
          } catch (e) {
            console.error("Failed to reverse geocode location", e);
          }
        },
        (error) => console.warn("Geolocation permission denied", error)
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (searchMode === 'range') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (end < start) {
        setError(t.errorFuture);
        return;
      }
      if (diffDays > 186) {
        setError(t.errorRange);
        return;
      }
    }

    setLoading(true);
    
    let p1Label = 'Person';
    let p2Label = 'Partner';
    if (isJointActivity) {
      if (language === Language.KANNADA) { p1Label = 'ವಧು'; p2Label = 'ವರ'; }
      else if (language === Language.HINDI) { p1Label = 'वधू'; p2Label = 'वर'; }
      else { p1Label = 'Bride'; p2Label = 'Groom'; }
    } else {
       if (language === Language.KANNADA) p1Label = 'ವ್ಯಕ್ತಿ';
       else if (language === Language.HINDI) p1Label = 'व्यक्ति';
    }

    const people = isJointActivity 
      ? [{ ...person1, label: p1Label }, { ...person2, label: p2Label }]
      : [{ ...person1, label: p1Label }];

    const request: MuhurtaRequest = {
      activity,
      location,
      startDate,
      endDate: searchMode === 'range' ? endDate : undefined,
      searchMode,
      people,
      language
    };

    try {
      const data = await findMuhurtas(request);
      setResult(data);
      setLastRequest(request);
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "An unexpected cosmic interference occurred.");
    } finally {
      setLoading(false);
    }
  };

  const currentRashis = language === Language.KANNADA ? RASHIS_KN : (language === Language.HINDI ? RASHIS_HI : RASHIS);
  const currentNakshatras = language === Language.KANNADA ? NAKSHATRAS_KN : (language === Language.HINDI ? NAKSHATRAS_HI : NAKSHATRAS);

  const renderPersonForm = (person: PersonDetails, setPerson: React.Dispatch<React.SetStateAction<PersonDetails>>, title: string) => (
    <div className="space-y-6 bg-stone-50/50 p-6 rounded-2xl border border-stone-100">
      <h3 className="text-orange-900 font-cinzel text-lg border-b border-orange-100 pb-2 font-bold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">{t.dob}</label>
          <input 
            type="date"
            required
            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 outline-none"
            value={person.birthDate}
            onChange={(e) => setPerson({...person, birthDate: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">{t.tob}</label>
          <input 
            type="time"
            required
            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 outline-none"
            value={person.birthTime}
            onChange={(e) => setPerson({...person, birthTime: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">{t.pob}</label>
          <input 
            type="text"
            placeholder="City, Country"
            required
            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 outline-none"
            value={person.birthPlace}
            onChange={(e) => setPerson({...person, birthPlace: e.target.value})}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5">
          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">{t.rashiLabel}</label>
          <select 
            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 outline-none"
            value={person.rashi}
            onChange={(e) => setPerson({...person, rashi: e.target.value})}
          >
            {currentRashis.map((rashi, idx) => (
              <option key={RASHIS[idx]} value={RASHIS[idx]}>{rashi}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-5">
          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">{t.nakLabel}</label>
          <select 
            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 outline-none"
            value={person.nakshatra}
            onChange={(e) => setPerson({...person, nakshatra: e.target.value})}
          >
            {currentNakshatras.map((n, idx) => (
              <option key={NAKSHATRAS[idx]} value={NAKSHATRAS[idx]}>{n}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">{t.padaLabel}</label>
          <select 
            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 outline-none"
            value={person.nakshatraPada}
            onChange={(e) => setPerson({...person, nakshatraPada: parseInt(e.target.value)})}
          >
            {PADA_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-10">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* PRINT-ONLY HEADER */}
        {lastRequest && (
          <div className="hidden print:block mb-8 border-b-2 border-stone-800 pb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                {/* Replace the src with your actual logo path or a base64 string */}
                <img src="/logo.png" alt="Sumuhoorta Logo" className="h-12 w-12" />
                <h1 className="text-4xl font-cinzel font-bold text-orange-900">SUMUHOORTA</h1>
              </div>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-cinzel font-bold text-orange-800">{t.reportTitle}</h2>
                <p className="text-sm text-stone-600 italic">Vedic Astrology Analysis</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{t.generatedOn}</p>
                <p className="text-sm font-bold">
                  {new Date().toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h2 className="text-base font-cinzel font-bold text-orange-800 border-b border-orange-100 mb-2 pb-1">{t.inputSummary}</h2>
                <div className="space-y-1 text-xs">
                  <p><span className="font-bold text-stone-500 uppercase text-[9px]">Activity:</span> {ACTIVITY_TRANSLATIONS[language][lastRequest.activity]}</p>
                  <p><span className="font-bold text-stone-500 uppercase text-[9px]">Location:</span> {lastRequest.location}</p>
                  <p><span className="font-bold text-stone-500 uppercase text-[9px]">Period:</span> {lastRequest.startDate} {lastRequest.endDate ? `to ${lastRequest.endDate}` : ''}</p>
                </div>
              </div>
              <div className="space-y-2">
                {lastRequest.people.map((p, i) => (
                  <div key={i} className="text-[10px] border-l-2 border-orange-200 pl-2">
                    <p className="font-bold">{p.label}</p>
                    <p>{p.rashi} • {p.nakshatra} (P{p.nakshatraPada})</p>
                  </div>
                ))}
              </div>
            </div>
            {/* PDF Disclaimer */}
            <div className="mt-6 pt-4 border-t border-stone-200 text-stone-500 text-[9px] italic leading-relaxed text-justify">
              {t.disclaimer}
            </div>
          </div>
        )}

        <section className="bg-white rounded-2xl shadow-xl border border-orange-50 overflow-hidden mb-8 no-print">
          <div className="md:flex">
            <div className="md:w-1/3 bg-orange-900 p-8 text-white">
              <h2 className="font-cinzel text-3xl font-bold mb-4">{t.inquiryTitle}</h2>
              <p className="text-orange-100 text-base leading-relaxed mb-6">
                {t.inquiryDesc}
              </p>
              
              <div className="space-y-4">
                {isJointActivity && (
                  <div className="bg-orange-800/40 p-4 rounded-xl text-sm space-y-2 border border-orange-700">
                    <p className="font-bold text-orange-300 uppercase tracking-widest text-xs">{t.jointAnalysis}</p>
                    {t.jointDetails.map((detail, i) => <p key={i} className="flex items-center opacity-90">{detail}</p>)}
                  </div>
                )}
                <div className="bg-orange-950/30 p-4 rounded-xl border border-orange-800/40">
                   <p className="font-bold text-orange-400 uppercase tracking-widest text-xs mb-1">{t.methodologyTitle}</p>
                   <p className="text-xs text-orange-100/70 leading-snug">{t.methodologyDesc}</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-800 mb-1.5">{t.activityLabel}</label>
                    <select 
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-base focus:ring-1 focus:ring-orange-500 outline-none"
                      value={activity}
                      onChange={(e) => setActivity(e.target.value as ActivityType)}
                    >
                      {Object.values(ActivityType).map(type => (
                        <option key={type} value={type}>
                          {ACTIVITY_TRANSLATIONS[language][type]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-800 mb-1.5">{t.cityLabel}</label>
                    <input 
                      type="text"
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-base focus:ring-1 focus:ring-orange-500 outline-none"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div>
                    <label className="block text-sm font-bold text-stone-800 mb-1.5">{t.searchModeLabel}</label>
                    <div className="flex bg-stone-50 border border-stone-200 rounded-lg p-1">
                      <button type="button" onClick={() => setSearchMode('range')} className={`flex-1 py-2 text-xs font-bold rounded-md ${searchMode === 'range' ? 'bg-orange-600 text-white shadow' : 'text-stone-500'}`}>{t.modeRange}</button>
                      <button type="button" onClick={() => setSearchMode('specific')} className={`flex-1 py-2 text-xs font-bold rounded-md ${searchMode === 'specific' ? 'bg-orange-600 text-white shadow' : 'text-stone-500'}`}>{t.modeSpecific}</button>
                    </div>
                  </div>
                  {searchMode === 'range' ? (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-stone-800 mb-1.5">{t.startDateLabel}</label>
                        <input type="date" required className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-800 mb-1.5">{t.endDateLabel}</label>
                        <input type="date" required className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-stone-800 mb-1.5">{t.specificDateLabel}</label>
                      <input type="date" required className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="border-b border-orange-100 pb-2">
                    <h3 className="text-orange-900 font-cinzel text-lg font-bold">{isJointActivity ? t.sec2TitleJoint : t.sec2Title}</h3>
                  </div>
                  <div className={`grid grid-cols-1 ${isJointActivity ? 'lg:grid-cols-2' : ''} gap-6`}>
                    {renderPersonForm(person1, setPerson1, isJointActivity ? t.brideDetails : t.genericDetails)}
                    {isJointActivity && renderPersonForm(person2, setPerson2, t.groomDetails)}
                  </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 text-[10px] text-stone-500 italic leading-relaxed text-justify">
                  {t.disclaimer}
                </div>

                <button type="submit" disabled={loading} className={`w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center ${loading ? 'opacity-70' : ''}`}>
                  {loading ? t.calculatingBtn : t.calculateBtn}
                </button>
              </form>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl text-sm font-medium text-red-800 shadow-sm no-print">
            ⚠️ {error}
          </div>
        )}

        {result && (
          <div id="results-section" className="space-y-8 pb-10">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 md:p-8 shadow-inner text-center md:text-left print:bg-white print:border-none print:shadow-none print:p-0">
              <h2 className="font-cinzel text-lg text-orange-900 mb-3 font-bold underline decoration-orange-200 underline-offset-4">
                {t.insightsTitle}
              </h2>
              <p className="text-stone-800 leading-relaxed text-sm italic font-medium">{result.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:block print:space-y-4">
              {result.muhurtas.map((muhurta, idx) => (
                <MuhurtaCard key={idx} data={muhurta} language={language} />
              ))}
            </div>

            <div className="bg-stone-100 p-6 rounded-xl border border-stone-200 text-stone-600 text-[10px] italic no-print leading-relaxed text-justify">
              {t.disclaimer}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 no-print">
              <button onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full sm:w-auto bg-stone-100 border border-stone-200 px-8 py-3 rounded-full text-stone-800 text-sm font-bold hover:bg-stone-200 transition-all">
                {t.newSearch}
              </button>
              <button 
                onClick={() => window.print()} 
                className="w-full sm:w-auto bg-orange-600 px-8 py-3 rounded-full text-white text-sm font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                {t.savePrint}
              </button>
            </div>
          </div>
        )}
        {/* ADD THIS BLOCK HERE */}
        {loading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm no-print">
            <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center border border-orange-100 max-w-sm w-full mx-4">
              {/* The Spinning Circle */}
              <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin mb-6"></div>
              
              {/* Work in Progress Message */}
              <h3 className="text-xl font-cinzel font-bold text-orange-900 mb-2 text-center">
                {language === Language.KANNADA ? 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...' : 
                 language === Language.HINDI ? 'विश्लेषण किया जा रहा है...' : 
                 'Analyzing Celestial Path...'}
              </h3>
              
              <p className="text-stone-600 text-center text-sm leading-relaxed">
                {language === Language.KANNADA ? 'ಗ್ರಹಗತಿಗಳನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಕೆಲವು ಕ್ಷಣ ಕಾಯಿರಿ.' : 
                 language === Language.HINDI ? 'ग्रहों की गणना की जा रही है। कृपया कुछ क्षण प्रतीक्षा करें।' : 
                 'Calculating precise auspicious windows. Please wait a moment.'}
              </p>
              
              <div className="mt-6 flex gap-1">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;