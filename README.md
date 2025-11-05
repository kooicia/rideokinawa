# Okinawa Bike Tour Website

A modern, minimal website for a 7-8 day bike tour with an admin interface for content management.

## Features

- **Landing Page**: Overview with destination, days, distance, elevation gain/drop
- **Daily Itinerary**: Detailed day-by-day schedule with timestamps, routes, meals, hotels, and photos
- **Weather Forecast**: Real-time weather updates from Open-Meteo API
- **Packing Recommendations**: Comprehensive packing list organized by category
- **Important Notes**: Safety tips, health considerations, cultural guidelines, and emergency contacts
- **Admin Panel**: Simple interface to update all content without code changes

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Open-Meteo API** - Free weather forecast service (no API key required)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
rideokinawa/
├── app/
│   ├── admin/          # Admin panel for content updates
│   ├── itinerary/      # Daily itinerary page
│   ├── weather/        # Weather forecast page
│   ├── packing/        # Packing list page
│   ├── notes/          # Important notes page
│   ├── layout.tsx      # Root layout with navigation
│   └── page.tsx        # Landing page
├── components/
│   └── Navigation.tsx  # Main navigation component
├── data/
│   └── tour-data.json  # All tour content (editable via admin)
└── public/             # Static assets
```

## Admin Panel

Access the admin panel at `/admin` to:
- Edit tour overview (title, destination, days, distance, elevation)
- Update daily itinerary (times, routes, meals, hotels)
- Modify important notes by category
- Update packing recommendations

**Note**: The admin panel currently saves to localStorage for demo purposes. In production, you would need to:
1. Create API routes (`/app/api/tour-data/route.ts`)
2. Connect to a database or file system
3. Add authentication if needed

## Customization

### Changing Tour Data

Edit `/data/tour-data.json` directly or use the admin panel.

### Styling

The design uses Tailwind CSS with custom fonts:
- **Inter** - Sans-serif for body text
- **Playfair Display** - Serif for headings (Butterfield-inspired)

Colors and styling can be customized in `app/globals.css` and individual components.

### Weather Location

Update the weather coordinates in `tour-data.json`:
```json
"weather": {
  "location": "Naha",
  "latitude": 26.2124,
  "longitude": 127.6809
}
```

## Building for Production

```bash
npm run build
npm start
```

## License

MIT
