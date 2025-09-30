# 🍱 MyFoodie

**MyFoodie** is a handcrafted React Native app that helps **busy employees** quickly decide where to grab lunch, based on their **location, time budget, dietary needs, and mood**.

This is a one-day prototype built as part of my personal portfolio to showcase **mobile app architecture, TypeScript, and user-centered problem solving**.

---

## 🚀 Features

- 📍 **Location-aware** — detect your position or fallback to a known office hub.
- ⏱ **Time budget filtering** — choose 10 / 20 / 30 / 45 minutes, and only see options that realistically fit.
- 🥗 **Dietary preferences** — vegan, vegetarian, halal, gluten-free support.
- 😋 **Mood-based suggestions** — light, comfort, or spicy recommendations.
- 🗺 **Actionable results** — one-tap directions via Google Maps, with optional call/order links.
- 🔒 **Resilient design** — works offline or if APIs fail, using a curated local seed dataset.

---

## 🎯 Business Value

Employees often waste precious lunch minutes browsing apps or defaulting to the same places.  
**MyFoodie solves this by:**

- Saving time → get back to work faster.
- Improving wellbeing → meals fit mood and dietary needs.
- Supporting local businesses → predictable lunchtime traffic.

This proof-of-concept demonstrates how **context-aware personalization** can improve user satisfaction and create opportunities for food delivery, wellness, and corporate engagement platforms.

---

## 🛠 Tech Stack

- [Expo](https://expo.dev/) + React Native (TypeScript)
- Expo Router for navigation
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) for geolocation
- [Overpass API](https://overpass-api.de) (OpenStreetMap) for nearby venues
- Pure TypeScript utilities for:
  - Haversine distance + walking ETA
  - Queue/prep heuristics
  - Scoring algorithm (proximity, time-fit, dietary-fit, mood-fit, price-fit, popularity)

---

## 📲 Running the app

1. Clone this repo:

   ```bash
   git clone https://github.com/your-username/myfoodie.git
   cd myfoodie
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start Expo:

   ```bash
   npx expo start
   ```

4. Open in:

- Expo Go app (scan QR code)
- IOS/Android simulator

⚠️ Note: Without a paid Apple Developer account, the app runs in Expo Go or your own local simulator/device.

## 📸 Demo

(Insert screenshots or a short demo video here — simulator recording is fine)

## 🧩 Future Enhancements

- Team lunch coordination (share a group link, consolidate picks)
- AsyncStorage to save user preferences
- Richer restaurant data (menu items, prices, photos)
- Push notifications for lunch reminders

## 👤 Author

Built with ❤️ by Alfons Caroles (aka Fonzie)
Frontend & Mobile Developer • 6+ years experience (React, React Native, Next.js, TypeScript)
