
export enum ActivityType {
  MARRIAGE = 'Marriage',
  ENGAGEMENT = 'Engagement',
  GRUHA_PRAVESHA = 'House Warming (Gruha Pravesha)',
  BUSINESS_START = 'New Business Venture',
  VEHICLE_PURCHASE = 'Vehicle Purchase',
  UPANAYANA = 'Upanayana (Thread Ceremony)',
  NAMAKARANA = 'Naming Ceremony (Namakarana)',
  HOME_BUYING = 'Home/Property Purchase',
  TRAVEL_WORK = 'Travel for Important Work',
  BUY_GOLD = 'Buying Jewellery & Gold',
  JOB_JOINING = 'Joining a New Job'
}

export enum Language {
  ENGLISH = 'en',
  KANNADA = 'kn',
  HINDI = 'hi'
}

export type SearchMode = 'range' | 'specific';

export const RASHIS = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrischika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
];

export const RASHIS_KN = [
  'ಮೇಷ', 'ವೃಷಭ', 'ಮಿಥುನ', 'ಕರ್ಕ',
  'ಸಿಂಹ', 'ಕನ್ಯಾ', 'ತುಲಾ', 'ವೃಶ್ಚಿಕ',
  'ಧನುಸ್ಸು', 'ಮಕರ', 'ಕುಂಭ', 'ಮೀನ'
];

export const RASHIS_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क',
  'सिंह', 'कन्या', 'तुला', 'वृश्चिक',
  'धनु', 'मकर', 'कुंभ', 'मीन'
];

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const NAKSHATRAS_KN = [
  'ಅಶ್ವಿನಿ', 'ಭರಣಿ', 'ಕೃತ್ತಿಕಾ', 'ರೋಹಿಣಿ', 'ಮೃಗಶಿರಾ', 'ಆರ್ದ್ರಾ', 'ಪುನರ್ವಸು', 'ಪುಷ್ಯ', 'ಆಶ್ಲೇಷ',
  'ಮಖಾ', 'ಪೂರ್ವಾ ಫಾಲ್ಗುಣಿ', 'ಉತ್ತರಾ ಫಾಲ್ಗುಣಿ', 'ಹಸ್ತಾ', 'ಚಿತ್ರಾ', 'ಸ್ವಾತಿ', 'ವಿಶಾಖಾ', 'ಅನುರಾಧಾ', 'ಜ್ಯೇಷ್ಠಾ',
  'ಮೂಲಾ', 'ಪೂರ್ವಾಷಾಢಾ', 'ಉತ್ತರಾಷಾಢಾ', 'ಶ್ರವಣಾ', 'ಧನಿಷ್ಠಾ', 'ಶತಭಿಷಾ', 'ಪೂರ್ವಾಭಾದ್ರಪದ', 'ಉತ್ತರಾಭಾದ್ರಪದ', 'ರೇವತಿ'
];

export const NAKSHATRAS_HI = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा',
  'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती'
];

export const ACTIVITY_TRANSLATIONS: Record<Language, Record<ActivityType, string>> = {
  [Language.ENGLISH]: {
    [ActivityType.MARRIAGE]: 'Marriage',
    [ActivityType.ENGAGEMENT]: 'Engagement',
    [ActivityType.GRUHA_PRAVESHA]: 'House Warming (Gruha Pravesha)',
    [ActivityType.BUSINESS_START]: 'New Business Venture',
    [ActivityType.VEHICLE_PURCHASE]: 'Vehicle Purchase',
    [ActivityType.UPANAYANA]: 'Upanayana (Thread Ceremony)',
    [ActivityType.NAMAKARANA]: 'Naming Ceremony (Namakarana)',
    [ActivityType.HOME_BUYING]: 'Home/Property Purchase',
    [ActivityType.TRAVEL_WORK]: 'Travel for Important Work',
    [ActivityType.BUY_GOLD]: 'Buying Jewellery & Gold',
    [ActivityType.JOB_JOINING]: 'Joining a New Job'
  },
  [Language.KANNADA]: {
    [ActivityType.MARRIAGE]: 'ವಿವಾಹ',
    [ActivityType.ENGAGEMENT]: 'ನಿಶ್ಚಿತಾರ್ಥ',
    [ActivityType.GRUHA_PRAVESHA]: 'ಗೃಹ ಪ್ರವೇಶ',
    [ActivityType.BUSINESS_START]: 'ಹೊಸ ವ್ಯಾಪಾರ ಆರಂಭ',
    [ActivityType.VEHICLE_PURCHASE]: 'ವಾಹನ ಖರೀದಿ',
    [ActivityType.UPANAYANA]: 'ಉಪನಯನ',
    [ActivityType.NAMAKARANA]: 'ನಾಮಕರಣ',
    [ActivityType.HOME_BUYING]: 'ಮನೆ/ಆಸ್ತಿ ಖರೀದಿ',
    [ActivityType.TRAVEL_WORK]: 'ಮುಖ್ಯ ಕಾರ್ಯಕ್ಕೆ ಪ್ರಯಾಣ',
    [ActivityType.BUY_GOLD]: 'ಚಿನ್ನಾಭರಣ ಖರೀದಿ',
    [ActivityType.JOB_JOINING]: 'ಹೊಸ ಉದ್ಯೋಗ ಸೇರ್ಪಡೆ'
  },
  [Language.HINDI]: {
    [ActivityType.MARRIAGE]: 'विवाह',
    [ActivityType.ENGAGEMENT]: 'सगाई',
    [ActivityType.GRUHA_PRAVESHA]: 'गृह प्रवेश',
    [ActivityType.BUSINESS_START]: 'नया व्यवसाय आरंभ',
    [ActivityType.VEHICLE_PURCHASE]: 'वाहन खरीद',
    [ActivityType.UPANAYANA]: 'उपनयन',
    [ActivityType.NAMAKARANA]: 'नामकरण',
    [ActivityType.HOME_BUYING]: 'घर/संपत्ति की खरीद',
    [ActivityType.TRAVEL_WORK]: 'महत्वपूर्ण कार्य के लिए यात्रा',
    [ActivityType.BUY_GOLD]: 'आभूषण और सोना खरीदना',
    [ActivityType.JOB_JOINING]: 'नई नौकरी की शुरुआत'
  }
};

export const PADA_OPTIONS = [1, 2, 3, 4];

export interface PersonDetails {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  rashi: string;
  nakshatra: string;
  nakshatraPada: number;
  label?: string;
}

export interface MuhurtaDetail {
  date: string;
  day: string;
  timeRange: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  description: string;
  auspiciousScore: number; // 1-100
}

export interface MuhurtaRequest {
  activity: ActivityType;
  location: string;
  startDate: string;
  endDate?: string;
  searchMode: SearchMode;
  additionalNotes?: string;
  people: PersonDetails[];
  language: Language;
}

export interface MuhurtaResponse {
  summary: string;
  muhurtas: MuhurtaDetail[];
}
