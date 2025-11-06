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
    },
    weather: {
      title: '天氣預報',
      subtitle: '每日天氣預報',
      loading: '載入天氣預報中...',
      error: '無法載入天氣預報，請稍後再試。',
      precipitation: '降雨量',
      windSpeed: '風速',
      note: '注意：',
      noteText: '天氣預報每日從 Open-Meteo 更新。天氣狀況可能變化，請在出發日期前再次確認預報。',
      travelDatesMoreThan14Days: '您的旅行日期距離現在超過14天。請在接近旅行日期時再次查看天氣預報。',
      checkBackCloser: '請在接近旅行日期時再次查看天氣預報。',
      currentWeekForecast: '以下是本週的目前天氣預報：',
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
    },
  },
};

