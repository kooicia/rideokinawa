export type Language = 'en' | 'zh-TW';

export interface Translations {
  nav: {
    overview: string;
    itinerary: string;
    weather: string;
    packing: string;
    notes: string;
    admin: string;
  };
  home: {
    title: string;
    viewItinerary: string;
    packingList: string;
    days: string;
    distance: string;
    elevationGain: string;
    elevationDrop: string;
    tourOverview: string;
    essentialInformation: string;
    dailyItinerary: string;
    dailyItineraryDesc: string;
    weatherForecast: string;
    weatherForecastDesc: string;
    importantNotes: string;
    importantNotesDesc: string;
  };
  itinerary: {
    title: string;
    subtitle: string;
    day: string;
    arrivalDay: string;
    departureDay: string;
    freeAndEasy: string;
    rideDay: string;
    departure: string;
    route: string;
    location: string;
    distance: string;
    elevationGain: string;
    dayDescription: string;
    highlights: string;
    meals: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    accommodation: string;
    photos: string;
    flightInformation: string;
    flightNumber: string;
      flightDetails: string;
      departureTime: string;
      arrivalTime: string;
      routeMap: string;
      elevationProfile: string;
      sunday: string;
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      daySuffix?: string;
      routeDetails: string;
      routeStopName: string;
      routeStopAddress: string;
      routeStopDistance: string;
      routeStopTags: string;
      tagFood: string;
      tagToilet: string;
      tagScenery: string;
      tagRest: string;
      tagHotel: string;
      tagLunch: string;
    };
  weather: {
    title: string;
    subtitle: string;
    loading: string;
    error: string;
    precipitation: string;
    windSpeed: string;
    note: string;
    noteText: string;
    travelDatesMoreThan14Days: string;
    checkBackCloser: string;
    currentWeekForecast: string;
    limitedRangeTitle: string;
    limitedRangeDescription: string;
    clearSky: string;
    mainlyClear: string;
    partlyCloudy: string;
    overcast: string;
    foggy: string;
    depositingRimeFog: string;
    lightDrizzle: string;
    moderateDrizzle: string;
    denseDrizzle: string;
    lightFreezingDrizzle: string;
    denseFreezingDrizzle: string;
    slightRain: string;
    moderateRain: string;
    heavyRain: string;
    slightSnow: string;
    moderateSnow: string;
    heavySnow: string;
    slightRainShowers: string;
    moderateRainShowers: string;
    violentRainShowers: string;
    slightSnowShowers: string;
    heavySnowShowers: string;
    thunderstorm: string;
    thunderstormWithHail: string;
    unknown: string;
  };
  packing: {
    title: string;
    subtitle: string;
    essentials: string;
    clothing: string;
    accessories: string;
    documents: string;
    tips: string;
  };
  notes: {
    title: string;
    subtitle: string;
    emergencyContacts: string;
    tourDetails: string;
    fitnessLevel: string;
    groupSize: string;
    supportVehicle: string;
    tipsForSuccess: string;
    safety: string;
    health: string;
    bikeEquipment: string;
    weather: string;
    cultural: string;
  };
  admin: {
    title: string;
    subtitle: string;
    saveChanges: string;
    saved: string;
    logout: string;
    overview: string;
    itinerary: string;
    notes: string;
    packing: string;
    edit: string;
    cancel: string;
    addHighlight: string;
    addItem: string;
    dayType: string;
    arrival: string;
    departure: string;
    freeAndEasy: string;
    ride: string;
    login: string;
    loginTitle: string;
    loginSubtitle: string;
    password: string;
    passwordPlaceholder: string;
    incorrectPassword: string;
    tourOverview: string;
    day: string;
    titleLabel: string;
    dateLabel: string;
    descriptionLabel: string;
    notesLabel: string;
    hotelName: string;
    address: string;
    phone: string;
    totalDistance: string;
    elevationGain: string;
    elevationDrop: string;
    destination: string;
    dailyHighlightPhotos: string;
    hotelPhotos: string;
    uploadMultiplePhotos: string;
    uploadMultiplePhotosHint: string;
    uploadImage: string;
    orEnterImageUrl: string;
    delete: string;
    addHotel: string;
    removeHotel: string;
    hotelWebsiteUrl: string;
    noHotelInfo: string;
    addMealOption: string;
    removeMealOption: string;
    mealOptionEnglish: string;
    mealOptionChinese: string;
    mealOptionMapsLink: string;
    mealOption: string;
    noMealOptions: string;
    highlightUrl: string;
    enableHighlights: string;
    highlightsEnabled: string;
    highlightsDisabled: string;
    routeDetails: string;
    enableRouteDetails: string;
    routeDetailsEnabled: string;
    routeDetailsDisabled: string;
    routeDetailsTitle: string;
    routeDetailsSubtitle: string;
    importFromCSV: string;
    importFromCSVHint: string;
    routeStopName: string;
    routeStopNameEn: string;
    routeStopNameZh: string;
    routeStopAddress: string;
    routeStopUrl: string;
    routeStopDistance: string;
    routeStopTags: string;
    addRouteStop: string;
    removeRouteStop: string;
    noRouteStops: string;
    routeStopNumber: string;
    csvFormatHint: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      overview: 'Overview',
      itinerary: 'Itinerary',
      weather: 'Weather',
      packing: 'Packing',
      notes: 'Notes',
      admin: 'Admin',
    },
    home: {
      title: 'Ride Okinawa',
      viewItinerary: 'View Itinerary',
      packingList: 'Packing List',
      days: 'Days',
      distance: 'Distance',
      elevationGain: 'Elevation Gain',
      elevationDrop: 'Elevation Drop',
      tourOverview: 'Tour Overview',
      essentialInformation: 'Essential Information',
      dailyItinerary: 'Daily Itinerary',
      dailyItineraryDesc: 'Detailed day-by-day schedule with routes, meals, and accommodations',
      weatherForecast: 'Weather Forecast',
      weatherForecastDesc: 'Real-time weather updates for your tour dates',
      importantNotes: 'Important Notes',
      importantNotesDesc: 'Safety tips, health considerations, and cultural guidelines',
    },
    itinerary: {
      title: 'Daily Itinerary',
      subtitle: 'Detailed schedule for each day of your tour',
      day: 'Day',
      arrivalDay: 'Arrival',
      departureDay: 'Departure',
      freeAndEasy: 'Free & Easy',
      rideDay: 'Ride',
      departure: 'Departure',
      route: 'Route',
      location: 'Location',
      distance: 'Distance',
      elevationGain: 'Elev Gain',
      dayDescription: 'Day Description',
      highlights: 'Highlights',
      meals: 'Meals',
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      accommodation: 'Accommodation',
      photos: 'Photos',
      flightInformation: 'Flight Information',
      flightNumber: 'Flight Number',
      flightDetails: 'Flight Details',
      departureTime: 'Departure Time',
      arrivalTime: 'Arrival Time',
      routeMap: 'Route Map',
      elevationProfile: 'Elevation Profile',
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      routeDetails: 'Route Details',
      routeStopName: 'Name',
      routeStopAddress: 'Address',
      routeStopDistance: 'Distance',
      routeStopTags: 'Tags',
      tagFood: 'Food',
      tagToilet: 'Toilet',
      tagScenery: 'Scenery',
      tagRest: 'Rest',
      tagHotel: 'Hotel',
      tagLunch: 'Lunch',
    },
    weather: {
      title: 'Weather Forecast',
      subtitle: 'Daily weather forecast for',
      loading: 'Loading weather forecast...',
      error: 'Failed to load weather forecast. Please try again later.',
      precipitation: 'Precipitation',
      windSpeed: 'Wind Speed',
      note: 'Note:',
      noteText: 'Weather forecasts are updated daily from Open-Meteo. Conditions may change, so please check the forecast closer to your departure date.',
      travelDatesMoreThan14Days: 'Your travel dates are more than 14 days away. Please check back closer to the travel dates for weather forecast.',
      checkBackCloser: 'Please check back closer to the travel dates for weather forecast.',
      currentWeekForecast: 'Below is the current weather forecast for this week:',
      limitedRangeTitle: 'Partial Forecast Shown',
      limitedRangeDescription: 'Forecast data is currently available only through {date}. Dates beyond this range have not been published yet.',
      clearSky: 'Clear sky',
      mainlyClear: 'Mainly clear',
      partlyCloudy: 'Partly cloudy',
      overcast: 'Overcast',
      foggy: 'Foggy',
      depositingRimeFog: 'Depositing rime fog',
      lightDrizzle: 'Light drizzle',
      moderateDrizzle: 'Moderate drizzle',
      denseDrizzle: 'Dense drizzle',
      lightFreezingDrizzle: 'Light freezing drizzle',
      denseFreezingDrizzle: 'Dense freezing drizzle',
      slightRain: 'Slight rain',
      moderateRain: 'Moderate rain',
      heavyRain: 'Heavy rain',
      slightSnow: 'Slight snow',
      moderateSnow: 'Moderate snow',
      heavySnow: 'Heavy snow',
      slightRainShowers: 'Slight rain showers',
      moderateRainShowers: 'Moderate rain showers',
      violentRainShowers: 'Violent rain showers',
      slightSnowShowers: 'Slight snow showers',
      heavySnowShowers: 'Heavy snow showers',
      thunderstorm: 'Thunderstorm',
      thunderstormWithHail: 'Thunderstorm with hail',
      unknown: 'Unknown',
    },
    packing: {
      title: 'Packing Recommendations',
      subtitle: 'Essential items to pack for your bike tour',
      essentials: 'Essentials',
      clothing: 'Clothing',
      accessories: 'Accessories',
      documents: 'Documents',
      tips: 'Packing Tips',
    },
    notes: {
      title: 'Important Notes',
      subtitle: 'Essential information for a safe and enjoyable tour',
      emergencyContacts: 'Emergency Contacts',
      tourDetails: 'Tour Details',
      fitnessLevel: 'Fitness Level:',
      groupSize: 'Group Size:',
      supportVehicle: 'Support Vehicle:',
      tipsForSuccess: 'Tips for Success',
      safety: 'Safety',
      health: 'Health',
      bikeEquipment: 'Bike & Equipment',
      weather: 'Weather',
      cultural: 'Cultural',
    },
    admin: {
      title: 'Admin Panel',
      subtitle: 'Edit tour content and information',
      saveChanges: 'Save Changes',
      saved: 'Saved successfully!',
      logout: 'Logout',
      overview: 'Overview',
      itinerary: 'Itinerary',
      notes: 'Notes',
      packing: 'Packing',
      edit: 'Edit',
      cancel: 'Cancel',
      addHighlight: 'Add Highlight',
      addItem: 'Add Item',
      dayType: 'Day Type',
      arrival: 'Arrival',
      departure: 'Departure',
      freeAndEasy: 'Free & Easy (City Tour)',
      ride: 'Ride',
      login: 'Login',
      loginTitle: 'Admin Access',
      loginSubtitle: 'Please enter the password to access the admin panel',
      password: 'Password',
      passwordPlaceholder: 'Enter password',
      incorrectPassword: 'Incorrect password. Please try again.',
      tourOverview: 'Tour Overview',
      day: 'Day',
      titleLabel: 'Title',
      dateLabel: 'Date',
      descriptionLabel: 'Description',
      notesLabel: 'Notes',
      hotelName: 'Hotel Name',
      address: 'Address',
      phone: 'Phone',
      totalDistance: 'Total Distance (km)',
      elevationGain: 'Elevation Gain (m)',
      elevationDrop: 'Elevation Drop (m)',
      destination: 'Destination',
      dailyHighlightPhotos: 'Daily Highlight Photos (3-5 images)',
      hotelPhotos: 'Hotel Photos (up to 3 images)',
      uploadMultiplePhotos: 'Upload Multiple Photos at Once',
      uploadMultiplePhotosHint: 'Select multiple photos at once (images will be automatically compressed)',
      uploadImage: 'Upload Image',
      orEnterImageUrl: 'Or Enter Image URL',
      delete: 'Delete',
      addHotel: 'Add Hotel',
      removeHotel: 'Remove Hotel',
      hotelWebsiteUrl: 'Hotel Website URL',
      noHotelInfo: 'No hotel information. Click "Add Hotel" to add accommodation details.',
      addMealOption: 'Add Option',
      removeMealOption: 'Remove Option',
      mealOptionEnglish: 'English',
      mealOptionChinese: 'Chinese',
      mealOptionMapsLink: 'Google Maps Link',
      mealOption: 'Option',
      noMealOptions: 'No options added. Click "Add Option" to add meal options.',
      highlightUrl: 'URL (Optional)',
      enableHighlights: 'Show Highlights',
      highlightsEnabled: 'Highlights Enabled',
      highlightsDisabled: 'Highlights Disabled',
      routeDetails: 'Route Details',
      enableRouteDetails: 'Enable Route Details',
      routeDetailsEnabled: 'Route Details Enabled',
      routeDetailsDisabled: 'Route Details Disabled',
      routeDetailsTitle: 'Route Details',
      routeDetailsSubtitle: 'Add detailed route stops for this day',
      importFromCSV: 'Import from CSV',
      importFromCSVHint: 'Upload a CSV file with header row. Column order is flexible. Supported headers: Name (English/Chinese), Address, URL, Distance, Tags',
      routeStopName: 'Stop Name',
      routeStopNameEn: 'Name (English)',
      routeStopNameZh: 'Name (Chinese)',
      routeStopAddress: 'Address',
      routeStopUrl: 'URL (Google Maps)',
      routeStopDistance: 'Distance (km)',
      routeStopTags: 'Tags (comma-separated: Food, Toilet, Scenery, Rest, Hotel)',
      addRouteStop: 'Add Stop',
      removeRouteStop: 'Remove Stop',
      noRouteStops: 'No route stops added. Click "Add Stop" to add stops.',
      routeStopNumber: 'Stop',
      csvFormatHint: 'CSV must have a header row. Column order is flexible. Example headers: "Name (English)", "Name (Chinese)", "Address", "URL", "Distance (km)", "Tags"',
    },
  },
  'zh-TW': {
    nav: {
      overview: '總覽',
      itinerary: '行程',
      weather: '天氣',
      packing: '打包清單',
      notes: '注意事項',
      admin: '管理',
    },
    home: {
      title: '騎行沖繩',
      viewItinerary: '查看行程',
      packingList: '打包清單',
      days: '天數',
      distance: '距離',
      elevationGain: '總爬升',
      elevationDrop: '總下降',
      tourOverview: '行程總覽',
      essentialInformation: '重要資訊',
      dailyItinerary: '每日行程',
      dailyItineraryDesc: '詳細的每日行程，包含路線、餐點和住宿',
      weatherForecast: '天氣預報',
      weatherForecastDesc: '即時的天氣更新資訊',
      importantNotes: '注意事項',
      importantNotesDesc: '安全提示、健康注意事項和文化指南',
    },
    itinerary: {
      title: '每日行程',
      subtitle: '詳細的每日行程安排',
      day: '第',
      daySuffix: '天',
      arrivalDay: '抵達',
      departureDay: '出發',
      freeAndEasy: '自由活動',
      rideDay: '騎行',
      departure: '出發時間',
      route: '路線',
      location: '地點',
      distance: '距離',
      elevationGain: '爬升',
      dayDescription: '行程說明',
      highlights: '行程亮點',
      meals: '餐點',
      breakfast: '早餐',
      lunch: '午餐',
      dinner: '晚餐',
      accommodation: '住宿',
      photos: '照片',
      flightInformation: '航班資訊',
      flightNumber: '航班號碼',
      flightDetails: '航班詳情',
      departureTime: '出發時間',
      arrivalTime: '抵達時間',
      routeMap: '路線地圖',
      elevationProfile: '海拔剖面圖',
      sunday: '星期日',
      monday: '星期一',
      tuesday: '星期二',
      wednesday: '星期三',
      thursday: '星期四',
      friday: '星期五',
      saturday: '星期六',
      routeDetails: '路線詳情',
      routeStopName: '名稱',
      routeStopAddress: '地址',
      routeStopDistance: '距離',
      routeStopTags: '標籤',
      tagFood: '餐點',
      tagToilet: '廁所',
      tagScenery: '風景',
      tagRest: '休息',
      tagHotel: '飯店',
      tagLunch: '午餐',
    },
    weather: {
      title: '天氣預報',
      subtitle: '查看目的地的即時天氣狀況：',
      loading: '正在取得天氣預報…',
      error: '目前無法取得天氣資訊，請稍後再試。',
      precipitation: '降雨量',
      windSpeed: '風速',
      note: '提醒：',
      noteText: '天氣可能隨時變動，建議在出發前再次查看最新預報。',
      travelDatesMoreThan14Days: '您的行程日期距今超過 14 天，天氣預報僅提供未來 14 天內的資訊。',
      checkBackCloser: '請接近出發日期時再查看。',
      currentWeekForecast: '目前改為顯示本週預報。',
      limitedRangeTitle: '僅顯示部分天氣預報',
      limitedRangeDescription: '目前僅提供至 {date} 的預報，超出範圍的日期尚未發布。',
      clearSky: '晴朗',
      mainlyClear: '大致晴朗',
      partlyCloudy: '多雲',
      overcast: '陰天',
      foggy: '有霧',
      depositingRimeFog: '結霜霧',
      lightDrizzle: '小雨',
      moderateDrizzle: '中雨',
      denseDrizzle: '大雨',
      lightFreezingDrizzle: '輕微凍雨',
      denseFreezingDrizzle: '強凍雨',
      slightRain: '小雨',
      moderateRain: '中雨',
      heavyRain: '大雨',
      slightSnow: '小雪',
      moderateSnow: '中雪',
      heavySnow: '大雪',
      slightRainShowers: '小陣雨',
      moderateRainShowers: '中陣雨',
      violentRainShowers: '強陣雨',
      slightSnowShowers: '小陣雪',
      heavySnowShowers: '強陣雪',
      thunderstorm: '雷暴',
      thunderstormWithHail: '雷暴帶冰雹',
      unknown: '未知',
    },
    packing: {
      title: '打包建議',
      subtitle: '單車旅行必備物品清單',
      essentials: '必需品',
      clothing: '服裝',
      accessories: '配件',
      documents: '文件',
      tips: '打包小貼士',
    },
    notes: {
      title: '注意事項',
      subtitle: '安全愉快的旅行所需的重要資訊',
      emergencyContacts: '緊急聯絡人',
      tourDetails: '行程詳情',
      fitnessLevel: '體能要求：',
      groupSize: '團體人數：',
      supportVehicle: '支援車輛：',
      tipsForSuccess: '成功小貼士',
      safety: '安全',
      health: '健康',
      bikeEquipment: '單車與裝備',
      weather: '天氣',
      cultural: '文化',
    },
    admin: {
      title: '管理面板',
      subtitle: '編輯行程內容和資訊',
      saveChanges: '儲存變更',
      saved: '已成功儲存！',
      logout: '登出',
      overview: '總覽',
      itinerary: '行程',
      notes: '注意事項',
      packing: '打包',
      edit: '編輯',
      cancel: '取消',
      addHighlight: '新增亮點',
      addItem: '新增項目',
      dayType: '日期類型',
      arrival: '抵達',
      departure: '出發',
      freeAndEasy: '自由活動（城市觀光）',
      ride: '騎行',
      login: '登入',
      loginTitle: '管理存取',
      loginSubtitle: '請輸入密碼以存取管理面板',
      password: '密碼',
      passwordPlaceholder: '輸入密碼',
      incorrectPassword: '密碼錯誤，請重試。',
      tourOverview: '行程總覽',
      day: '第',
      titleLabel: '標題',
      dateLabel: '日期',
      descriptionLabel: '描述',
      notesLabel: '備註',
      hotelName: '飯店名稱',
      address: '地址',
      phone: '電話',
      totalDistance: '總距離 (公里)',
      elevationGain: '總爬升 (公尺)',
      elevationDrop: '總下降 (公尺)',
      destination: '目的地',
      dailyHighlightPhotos: '每日亮點照片 (3-5 張)',
      hotelPhotos: '飯店照片 (最多 3 張)',
      uploadMultiplePhotos: '一次上傳多張照片',
      uploadMultiplePhotosHint: '可一次選擇多張照片（圖片將自動壓縮）',
      uploadImage: '上傳圖片',
      orEnterImageUrl: '或輸入圖片網址',
      delete: '刪除',
      addHotel: '新增飯店',
      removeHotel: '移除飯店',
      hotelWebsiteUrl: '飯店網站網址',
      noHotelInfo: '尚無飯店資訊。點擊「新增飯店」以新增住宿詳情。',
      addMealOption: '新增選項',
      removeMealOption: '移除選項',
      mealOptionEnglish: '英文',
      mealOptionChinese: '中文',
      mealOptionMapsLink: 'Google 地圖連結',
      mealOption: '選項',
      noMealOptions: '尚未新增選項。點擊「新增選項」以新增餐點選項。',
      highlightUrl: '連結（選填）',
      enableHighlights: '顯示亮點',
      highlightsEnabled: '亮點已啟用',
      highlightsDisabled: '亮點已停用',
      routeDetails: '路線詳情',
      enableRouteDetails: '啟用路線詳情',
      routeDetailsEnabled: '路線詳情已啟用',
      routeDetailsDisabled: '路線詳情已停用',
      routeDetailsTitle: '路線詳情',
      routeDetailsSubtitle: '為此日新增詳細的路線停靠點',
      importFromCSV: '從 CSV 匯入',
      importFromCSVHint: '上傳包含標題列的 CSV 檔案。欄位順序可彈性調整。支援的標題：名稱（英文/中文）、地址、網址、距離、標籤',
      routeStopName: '停靠點名稱',
      routeStopNameEn: '名稱（英文）',
      routeStopNameZh: '名稱（中文）',
      routeStopAddress: '地址',
      routeStopUrl: '網址（Google 地圖）',
      routeStopDistance: '距離（公里）',
      routeStopTags: '標籤（逗號分隔：Food, Toilet, Scenery, Rest, Hotel）',
      addRouteStop: '新增停靠點',
      removeRouteStop: '移除停靠點',
      noRouteStops: '尚未新增停靠點。點擊「新增停靠點」以新增停靠點。',
      routeStopNumber: '停靠點',
      csvFormatHint: 'CSV 必須包含標題列。欄位順序可彈性調整。範例標題：「名稱（英文）」、「名稱（中文）」、「地址」、「網址」、「距離（公里）」、「標籤」',
    },
  },
};

