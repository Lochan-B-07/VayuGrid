/**
 * VayuGrid Serverless Microclimate, Sensitive Infrastructure & Incident Database
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

export const SENSITIVE_RECEPTORS = [
  // Delhi
  { id: 'DEL-REC-01', city_id: 'delhi', name: 'Sarvodaya Kanya Vidyalaya', type: 'SCHOOL', lat: 28.6385, lng: 77.2180, capacity: 850 },
  { id: 'DEL-REC-02', city_id: 'delhi', name: 'North Delhi Community Health Centre', type: 'HOSPITAL', lat: 28.6420, lng: 77.2240, capacity: 120 },
  { id: 'DEL-REC-03', city_id: 'delhi', name: 'Rohini Metro Transit Hub', type: 'TRANSIT', lat: 28.6340, lng: 77.2120, capacity: 4200 },
  { id: 'DEL-REC-04', city_id: 'delhi', name: 'Bhalaswa Informal Settlement School', type: 'SCHOOL', lat: 28.6480, lng: 77.2290, capacity: 450 },

  // Bengaluru
  { id: 'BLR-REC-01', city_id: 'bengaluru', name: 'National Public School Koramangala', type: 'SCHOOL', lat: 12.9352, lng: 77.6245, capacity: 1200 },
  { id: 'BLR-REC-02', city_id: 'bengaluru', name: 'St. John\'s Medical College Hospital', type: 'HOSPITAL', lat: 12.9288, lng: 77.6189, capacity: 600 },
  { id: 'BLR-REC-03', city_id: 'bengaluru', name: 'Silk Board Transit Interchange', type: 'TRANSIT', lat: 12.9177, lng: 77.6238, capacity: 9500 },

  // Kanpur
  { id: 'KNP-REC-01', city_id: 'kanpur', name: 'GSVM Government Medical College', type: 'HOSPITAL', lat: 26.4682, lng: 80.3204, capacity: 800 },
  { id: 'KNP-REC-02', city_id: 'kanpur', name: 'Jajmau Primary School', type: 'SCHOOL', lat: 26.4255, lng: 80.4010, capacity: 380 },

  // Mumbai
  { id: 'MUM-REC-01', city_id: 'mumbai', name: 'KEM Hospital & Research Centre', type: 'HOSPITAL', lat: 19.0022, lng: 72.8428, capacity: 1800 },
  { id: 'MUM-REC-02', city_id: 'mumbai', name: 'Dharavi Slum Children\'s Center', type: 'COMMUNITY', lat: 19.0410, lng: 72.8530, capacity: 720 },

  // Punjab
  { id: 'PJB-REC-01', city_id: 'punjab', name: 'Ludhiana Civil Hospital', type: 'HOSPITAL', lat: 30.9120, lng: 75.8450, capacity: 400 },
  { id: 'PJB-REC-02', city_id: 'punjab', name: 'Government Senior Secondary School Khanna', type: 'SCHOOL', lat: 30.7050, lng: 76.2200, capacity: 650 },
];

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
    ta: 'காற்றுத் தரம் அறிவிப்பு: கட்டுமானப் பணிகளால் அதிக அளவு தூசி காற்றில் கலக்கிறது. சுவாசக் கோளாறு உள்ளவர்கள் பாதுகாப்பாக இருக்கவும்.',
    ml: 'വായു ഗുണനിലവാര മുന്നറിയിപ്പ്: നിർമ്മാണ പ്രവർത്തനങ്ങളിൽ നിന്നുള്ള കടുത്ത പൊടിപടലങ്ങൾ പടരുന്നു. ജാഗ്രത പാലിക്കുക.',
  },
};
