/**
 * ============================================================================
 * VayuGrid Serverless Microclimate, Sensitive Infrastructure & Incident Database
 * ============================================================================
 *
 * @file mockDatabase.js
 * @module api/_lib/mockDatabase
 * @description
 * In-memory statutory repository representing India's National Clean Air Programme
 * (NCAP) monitoring infrastructure, regional pollution archetypes, sensitive human
 * receptors (schools, hospitals, transit hubs), and multi-lingual vernacular advisories.
 *
 * ARCHITECTURAL CONTEXT & ZERO-GCP-CREDITS RATIONALE:
 * ---------------------------------------------------
 * Without access to a funded, persistent Google Cloud SQL / PostGIS database or
 * paid Cloud Translation / Vertex AI API quotas during prototype evaluation and
 * hackathon reviews, this file provides an immutable, high-fidelity reference dataset.
 * It allows the Vercel Serverless Edge deployment (https://vayu-grid.vercel.app) to
 * execute real-world spatial intersections, exposure assessments, and multilingual
 * alerting without ongoing hosting costs or dependency failures.
 *
 * PROBLEM STATEMENT ALIGNMENT (POLLUTION REDUCTION):
 * --------------------------------------------------
 * 1. Monitored City Archetypes: Covers 5 distinct geographical micro-basins across
 *    India experiencing severe episodic air pollution (stubble smog, valley inversion,
 *    coastal trapping, and tech corridor dust).
 * 2. Sensitive Receptor Registry: Pre-locates high-vulnerability facilities (schools,
 *    maternity hospitals, informal settlements) to calculate toxic plume arrival ETAs.
 * 3. Vernacular Equity: Translates statutory air warnings into 6 major Indian languages
 *    (English, Hindi, Telugu, Kannada, Tamil, Malayalam) so non-English-speaking
 *    residents can immediately take protective shelter before toxic smoke arrives.
 * ============================================================================
 */

/**
 * Statutory CPCB Non-Attainment City Archetypes
 * Grounded in official Central Pollution Control Board (CPCB) monitoring profiles.
 */
export const CITIES = [
  {
    id: 'delhi',
    alias_id: 'delhi_ncr',
    name: 'Delhi-NCR',
    state: 'National Capital Region',
    archetype: 'Polycentric Megacity / Regional Stubble & Winter Inversion Smog',
    center: { lat: 28.6139, lng: 77.2090 },
    zoom: 12,
    cpcb_stations_count: 40,
    current_aqi: 342,
    category: 'VERY_POOR',
    primary_pollutant: 'PM2.5',
    active_incidents: 6,
    terrain: 'URBAN',
    default_weather: {
      wind_speed_ms: 3.8,
      wind_direction_deg: 310.0,
      downwind_bearing_deg: 130.0,
      temperature_c: 24.2,
      humidity_pct: 68.0,
      pbl_height_m: 420.0,
      stability_class: 'D',
    },
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    archetype: 'Peninsular Ridge / Tech Corridor Vehicular & Dust Micro-Basin',
    center: { lat: 12.9716, lng: 77.5946 },
    zoom: 12,
    cpcb_stations_count: 14,
    current_aqi: 118,
    category: 'MODERATE',
    primary_pollutant: 'PM10',
    active_incidents: 3,
    terrain: 'URBAN',
    default_weather: {
      wind_speed_ms: 4.5,
      wind_direction_deg: 90.0,
      downwind_bearing_deg: 270.0,
      temperature_c: 27.5,
      humidity_pct: 54.0,
      pbl_height_m: 950.0,
      stability_class: 'C',
    },
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    archetype: 'Gangetic Basin / Thermal Inversion & Tannery Industrial Cluster',
    center: { lat: 26.4499, lng: 80.3319 },
    zoom: 12,
    cpcb_stations_count: 8,
    current_aqi: 389,
    category: 'VERY_POOR',
    primary_pollutant: 'PM2.5 / Cr-VI',
    active_incidents: 4,
    terrain: 'URBAN',
    default_weather: {
      wind_speed_ms: 2.4,
      wind_direction_deg: 290.0,
      downwind_bearing_deg: 110.0,
      temperature_c: 22.8,
      humidity_pct: 72.0,
      pbl_height_m: 350.0,
      stability_class: 'E',
    },
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    archetype: 'Coastal Megacity / Land-Sea Breeze Trapping & Canyon Corridor',
    center: { lat: 19.0760, lng: 72.8777 },
    zoom: 12,
    cpcb_stations_count: 22,
    current_aqi: 164,
    category: 'MODERATE',
    primary_pollutant: 'PM2.5',
    active_incidents: 3,
    terrain: 'URBAN',
    default_weather: {
      wind_speed_ms: 5.2,
      wind_direction_deg: 240.0,
      downwind_bearing_deg: 60.0,
      temperature_c: 31.0,
      humidity_pct: 78.0,
      pbl_height_m: 720.0,
      stability_class: 'C',
    },
  },
  {
    id: 'punjab',
    name: 'Punjab Agrarian Belt',
    state: 'Punjab',
    archetype: 'Post-Harvest Paddy Stubble Biomass Pyrolysis Belt',
    center: { lat: 30.9010, lng: 75.8573 },
    zoom: 11,
    cpcb_stations_count: 10,
    current_aqi: 395,
    category: 'VERY_POOR',
    primary_pollutant: 'PM2.5',
    active_incidents: 7,
    terrain: 'RURAL_OPEN',
    default_weather: {
      wind_speed_ms: 2.9,
      wind_direction_deg: 325.0,
      downwind_bearing_deg: 145.0,
      temperature_c: 21.5,
      humidity_pct: 65.0,
      pbl_height_m: 380.0,
      stability_class: 'D',
    },
  },
];

/**
 * Geocoded Sensitive Receptors Registry
 * Used for automated geometrical intersection with downwind dispersion isopleths.
 */
export const SENSITIVE_RECEPTORS = [
  // Delhi-NCR Receptors
  { id: 'DEL-REC-01', city_id: 'delhi', name: 'Sarvodaya Kanya Vidyalaya', type: 'SCHOOL', lat: 28.6385, lng: 77.2180, capacity: 850 },
  { id: 'DEL-REC-02', city_id: 'delhi', name: 'North Delhi Community Health Centre', type: 'HOSPITAL', lat: 28.6420, lng: 77.2240, capacity: 120 },
  { id: 'DEL-REC-03', city_id: 'delhi', name: 'Rohini Metro Transit Hub', type: 'TRANSIT', lat: 28.6340, lng: 77.2120, capacity: 4200 },
  { id: 'DEL-REC-04', city_id: 'delhi', name: 'Bhalaswa Informal Settlement School', type: 'SCHOOL', lat: 28.6480, lng: 77.2290, capacity: 450 },

  // Bengaluru Receptors
  { id: 'BLR-REC-01', city_id: 'bengaluru', name: 'National Public School Koramangala', type: 'SCHOOL', lat: 12.9352, lng: 77.6245, capacity: 1200 },
  { id: 'BLR-REC-02', city_id: 'bengaluru', name: "St. John's Medical College Hospital", type: 'HOSPITAL', lat: 12.9288, lng: 77.6189, capacity: 600 },
  { id: 'BLR-REC-03', city_id: 'bengaluru', name: 'Silk Board Transit Interchange', type: 'TRANSIT', lat: 12.9177, lng: 77.6238, capacity: 9500 },

  // Kanpur Receptors
  { id: 'KNP-REC-01', city_id: 'kanpur', name: 'GSVM Government Medical College', type: 'HOSPITAL', lat: 26.4682, lng: 80.3204, capacity: 800 },
  { id: 'KNP-REC-02', city_id: 'kanpur', name: 'Jajmau Primary School', type: 'SCHOOL', lat: 26.4255, lng: 80.4010, capacity: 380 },

  // Mumbai Receptors
  { id: 'MUM-REC-01', city_id: 'mumbai', name: 'KEM Hospital & Research Centre', type: 'HOSPITAL', lat: 19.0022, lng: 72.8428, capacity: 1800 },
  { id: 'MUM-REC-02', city_id: 'mumbai', name: "Dharavi Slum Children's Center", type: 'COMMUNITY', lat: 19.0410, lng: 72.8530, capacity: 720 },

  // Punjab Receptors
  { id: 'PJB-REC-01', city_id: 'punjab', name: 'Ludhiana Civil Hospital', type: 'HOSPITAL', lat: 30.9120, lng: 75.8450, capacity: 400 },
  { id: 'PJB-REC-02', city_id: 'punjab', name: 'Government Senior Secondary School Khanna', type: 'SCHOOL', lat: 30.7050, lng: 76.2200, capacity: 650 },
];

/**
 * Statutory Vernacular Emergency Advisory Templates
 * Pre-compiled across 6 languages for all 6 emission archetypes.
 */
export const VERNACULAR_TEMPLATES = {
  OPEN_MUNICIPAL_WASTE_BURNING: {
    en: 'URGENT HEALTH ADVISORY: Active municipal waste burning detected in your sector. Highly toxic dioxin & PM2.5 smoke is drifting downwind. Keep windows closed and wear N95 filtration.',
    hi: 'आपातकालीन वायु स्वास्थ्य चेतावनी: आपके क्षेत्र में नगरपालिका कचरा जलाने की पुष्टि हुई है। विषैला धुआं और PM2.5 हवा के साथ आगे बढ़ रहा है। खिड़कियां बंद रखें और N95 मास्क पहनें।',
    te: 'అత్యవసర ఆరోగ్య హెచ్చరిక: మీ ప్రాంతంలో మునిసిపల్ వ్యర్థాల దహనం గుర్తించబడింది. విషపూరిత పొగ మరియు PM2.5 గాలి దిశగా వ్యాపిస్తోంది. కిటికీలు మూసివేసి N95 మాస్క్ ధరించండి.',
    kn: 'ತುರ್ತು ಆರೋಗ್ಯ ಸಲಹೆ: ನಿಮ್ಮ ವಲಯದಲ್ಲಿ ಪುರಸಭೆ ತ್ಯಾಜ್ಯ ಸುಡುವುದು ಪತ್ತೆಯಾಗಿದೆ. ವಿಷಕಾರಿ ಹೊಗೆ ಮತ್ತು PM2.5 ಗಾಳಿಯ ದಿಕ್ಕಿನಲ್ಲಿ ಹರಡುತ್ತಿದೆ. ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಿ ಮತ್ತು N95 ಮಾಸ್ಕ್ ಧರಿಸಿ.',
    ta: 'அவசர சுகாதார எச்சரிக்கை: உங்கள் பகுதியில் நகராட்சி குப்பைகள் எரிக்கப்படுவது கண்டறியப்பட்டுள்ளது. நச்சுப் புகை உங்கள் பகுதிக்கு நகர்கிறது. ஜன்னல்களை மூடி N95 முகக்கவசம் அணியுங்கள்.',
    ml: 'അടിയന്തര ആരോഗ്യ മുന്നറിയിപ്പ്: നിങ്ങളുടെ മേഖലയിൽ മുനിസിപ്പൽ മാലിന്യം കത്തിക്കുന്നത് കണ്ടെത്തിയിരിക്കുന്നു. വിഷപ്പുക കാറ്റിൽ പടരുന്നു. ജനലുകൾ അടയ്ക്കുകയും N95 മാസ്ക് ധരിക്കുകയും ചെയ്യുക.',
  },
  CONSTRUCTION_DEMOLITION_DUST: {
    en: 'AIR QUALITY NOTICE: Severe fugitive particulate dust from construction activity identified. Downwind respiratory risk is critical. Anti-smog water mist units dispatched.',
    hi: 'वायु गुणवत्ता चेतावनी: निर्माण गतिविधियों से अत्यधिक धूल और PM10 कणों का फैलाव देखा गया है। संवेदनशील नागरिक श्वसन सुरक्षा उपाय अपनाएं। पानी के छिड़काव वाहन भेजे गए हैं।',
    te: 'వాయు కాలుష్య హెచ్చరిక: నిర్మాణ రంగం నుండి తీవ్రమైన ధూళి కణాలు వ్యాపిస్తున్నాయి. శ్వాసకోశ సమస్యలు ఉన్నవారు జాగ్రత్త వహించండి. వాటర్ మిస్ట్ వాహనాలు తరలించబడ్డాయి.',
    kn: 'ವಾಯು ಗುಣಮಟ್ಟ ಎಚ್ಚರಿಕೆ: ನಿರ್ಮಾಣ ಕಾಮಗಾರಿಯಿಂದ ತೀವ್ರ ಧೂಳು ಹೊರಹೊಮ್ಮುತ್ತಿದೆ. ಉಸಿರಾಟದ ತೊಂದರೆ ಇರುವವರು ಸುರಕ್ಷಿತವಾಗಿರಿ. ನೀರು ಸಿಂಪಡಿಸುವ ವಾಹನಗಳನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ.',
    ta: 'காற்றுத் தரம் அறிவிப்பு: கட்டுமானப் பணிகளால் அதிக அளவு தூசி காற்றில் கலக்கிறது. சுவாசக் கோளாறு உள்ளவர்கள் பாதுகாப்பாக இருக்கவும். நீர் தெளிப்பான்கள் அனுப்பப்பட்டுள்ளன.',
    ml: 'വായു ഗുണനിലവാര മുന്നറിയിപ്പ്: നിർമ്മാണ പ്രവർത്തനങ്ങളിൽ നിന്നുള്ള കടുത്ത പൊടിപടലങ്ങൾ പടരുന്നു. ജാഗ്രത പാലിക്കുക. വാട്ടർ മിസ്റ്റിംഗ് യൂണിറ്റുകൾ അയച്ചിട്ടുണ്ട്.',
  },
  INDUSTRIAL_STACK_EMISSION: {
    en: 'STATUTORY EMISSION ALERT: High-density industrial plume exceeding statutory opacity detected. Downwind wards must minimize outdoor exertion.',
    hi: 'वैधानिक उत्सर्जन चेतावनी: अत्यधिक औद्योगिक धुआं और रासायनिक गैसों का फैलाव दर्ज किया गया है। डाउनविंड क्षेत्रों के नागरिक घर के अंदर रहें।',
    te: 'పరిశ్రమ కాలుష్య హెచ్చరిక: నిర్దేశిత పరిమితికి మించి పారిశ్రామిక రసాయన పొగ విడుదలవుతోంది. సమీప ప్రజలు బయటకు రాకుండా ఉండండి.',
    kn: 'ಕೈಗಾರಿಕಾ ಹೊರಸೂಸುವಿಕೆ ಎಚ್ಚರಿಕೆ: ಮಿತಿಮೀರಿದ ವಿಷಕಾರಿ ಕೈಗಾರಿಕಾ ಹೊಗೆ ಪತ್ತೆಯಾಗಿದೆ. ಸುತ್ತಮುತ್ತಲಿನ ನಾಗರಿಕರು ಒಳಾಂಗಣದಲ್ಲಿಯೇ ಇರಲು ಸೂಚಿಸಲಾಗಿದೆ.',
    ta: 'தொழில்துறை புகை எச்சரிக்கை: வரம்பை மீறிய நச்சுப் புகை வெளியேற்றம் கண்டறியப்பட்டுள்ளது. பொதுமக்கள் வெளியில் செல்வதைத் தவிர்க்கவும்.',
    ml: 'വ്യവസായ പുക മുന്നറിയിപ്പ്: പരിധി കവിഞ്ഞ രാസപുക പുറന്തള്ളൽ കണ്ടെത്തിയിരിക്കുന്നു. പരിസരവാസികൾ വീടുകൾക്കുള്ളിൽ തന്നെ കഴിയുക.',
  },
  BIOMASS_STUBBLE_BURNING: {
    en: 'AGRICULTURAL SMOG WARNING: Open agricultural stubble burning detected. Dense pyrolytic smoke column drifting downwind. Wear respirators.',
    hi: 'कृषि पराली धुआं चेतावनी: खेतों में पराली जलाने से घना विषैला धुआं फैल रहा है। बुजुर्ग और बच्चे विशेष सावधानी बरतें। N95 मास्क अनिवार्य है।',
    te: 'వ్యవసాయ వ్యర్థాల దహన హెచ్చరిక: పంట వ్యర్థాల దహనం వల్ల దట్టమైన పొగ వ్యాపిస్తోంది. శ్వాసకోశ సమస్యలు రాకుండా మాస్క్ ధరించండి.',
    kn: 'ಕೃಷಿ ತ್ಯಾಜ್ಯ ಸುಡುವಿಕೆ ಎಚ್ಚರಿಕೆ: ಭತ್ತದ ಕೂಳೆ ಸುಡುವುದರಿಂದ ದಟ್ಟ ಹೊಗೆ ಆವರಿಸುತ್ತಿದೆ. ವೃದ್ಧರು ಮತ್ತು ಮಕ್ಕಳು ವಿಶೇಷ ಮುನ್ನೆಚ್ಚರಿಕೆ ವಹಿಸಿ.',
    ta: 'விவசாயக் கழிவு எரிப்பு எச்சரிக்கை: வயல்வெளிகளில் வைக்கோல் எரிப்பதால் புகை மண்டலம் உருவாகியுள்ளது. பொதுமக்கள் முகக்கவசம் அணியவும்.',
    ml: 'കാർഷിക മാലിന്യ പുക മുന്നറിയിപ്പ്: വൈക്കോൽ കത്തിക്കൽ കാരണം കനത്ത പുക പടരുന്നു. കുട്ടികളും പ്രായമായവരും സുരക്ഷിതമായിരിക്കുക.',
  },
  HIGH_DENSITY_VEHICULAR_IDLING: {
    en: 'TRAFFIC POLLUTION HOTSPOT: High vehicular idling accumulation detected. Severe NOx and ultrafine PM concentrations. Avoid non-essential transit through corridor.',
    hi: 'यातायात प्रदूषण चेतावनी: अत्यधिक वाहन जाम से NOx और सूक्ष्म कणों का गंभीर जमावड़ा। इस मार्ग पर अनावश्यक आवागमन से बचें।',
    te: 'ట్రాఫిక్ కాలుష్య హెచ్చరిక: విపరీతమైన ట్రాఫిక్ జామ్ వల్ల వాయు కాలుష్యం తీవ్రమైంది. ఈ మార్గంలో ప్రయాణాన్ని నివారించండి.',
    kn: 'ಸಂಚಾರ ಮಾಲಿನ್ಯ ಎಚ್ಚರಿಕೆ: ವಾಹನ ದಟ್ಟಣೆಯಿಂದಾಗಿ ವಿಷಕಾರಿ ಅನಿಲಗಳು ಸಂಗ್ರಹವಾಗುತ್ತಿವೆ. ಈ ಮಾರ್ಗದಲ್ಲಿ ಅನಗತ್ಯ ಸಂಚಾರ ತಪ್ಪಿಸಿ.',
    ta: 'போக்குவரத்து மாசுபாடு அறிவிப்பு: வாகன நெரிசலால் அதிக அளவு நச்சு வாயுக்கள் வெளியேறுகின்றன. இப்பாதையை தவிர்க்கவும்.',
    ml: 'ട്രാഫിക് മലിനീകരണ മുന്നറിയിപ്പ്: വാഹനക്കുരുക്ക് കാരണം വായു മലിനീകരണം അതീവ രൂക്ഷം. ഈ വഴി യാത്ര ഒഴിവാക്കുക.',
  },
  UNPAVED_ROAD_SUSPENSION: {
    en: 'FUGITIVE DUST ADVISORY: Heavy mechanical silt re-suspension along unpaved corridor. Mechanized road sweepers and water misting scheduled.',
    hi: 'सड़क धूलि चेतावनी: कच्ची सड़क से अत्यधिक धूल का गुबार हवा में उड़ रहा है। सड़क सफाई और छिड़काव मशीनें भेजी जा रही हैं।',
    te: 'రహదారి ధూళి హెచ్చరిక: రద్దీ మార్గాల్లో దుమ్ము తీవ్రంగా లేస్తోంది. మునిసిపల్ క్లీనింగ్ వాహనాలు రంగంలోకి దిగాయి.',
    kn: 'ರಸ್ತೆ ಧೂಳು ಎಚ್ಚರಿಕೆ: ರಸ್ತೆ ಬದಿಯ ಧೂಳು ಗಾಳಿಯಲ್ಲಿ ಹೆಚ್ಚುತ್ತಿದೆ. ಯಾಂತ್ರಿಕ ಸ್ವಚ್ಛತಾ ವಾಹನಗಳನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ.',
    ta: 'சாலை தூசி எச்சரிக்கை: சாலைகளில் அதிக அளவு புழுதி பறக்கிறது. இயந்திரமயமாக்கப்பட்ட துப்புரவு வாகனங்கள் அனுப்பப்படுகின்றன.',
    ml: 'റോഡ് പൊടി മുന്നറിയിപ്പ്: റോഡിൽ നിന്നുള്ള പൊടിപടലങ്ങൾ ശക്തമായി പടരുന്നു. യന്ത്രവൽകൃത ക്ലീനിംഗ് വാഹനങ്ങൾ അയച്ചിട്ടുണ്ട്.',
  },
};
