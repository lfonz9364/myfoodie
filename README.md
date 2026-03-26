# 🍱 MyFoodie

**MyFoodie** is an AI-inspired React Native app that helps **busy employees** quickly decide where to grab lunch based on their **location, time budget, dietary needs, and mood**.

Instead of listing all nearby options, MyFoodie uses a **heuristic recommendation engine** to rank restaurants based on real-world constraints like walking time, preparation time, and queue estimation—helping users make faster, smarter decisions.

This is a one-day prototype built as part of my portfolio to showcase **mobile architecture, TypeScript, and user-centered product thinking**.

---

## 🚀 Features

- 📍 **Location-aware** — use your current location or enter an address manually.
- 💾 **Cached results** — stores the latest successful restaurant list for offline fallback.
- 📶 **Offline-aware** — shows a clear in-app notice when internet access is unavailable.
- ⏱ **Time budget filtering** — 10 / 20 / 30 / 45 minutes with realistic feasibility
- 🥗 **Dietary preferences** — vegan, vegetarian, halal, gluten-free
- 😋 **Mood-based suggestions** — light, comfort, or spicy
- 🧠 **Smart ranking engine** — prioritizes options that best fit your current context
- 🗺 **In-app map preview** — view destination and quickly navigate
- ⚡ **Quick actions** — open directions, new search and back to results in one tap
- 🌗 **Light & dark mode** — centralized theming system

---

## 🧠 How It Works

MyFoodie uses a **deterministic, rule-based recommendation system** to rank nearby food options.

Each venue is scored using a weighted combination of:

- Walking distance (Haversine + estimated travel time)
- Estimated preparation time
- Queue time heuristic
- Dietary compatibility
- Mood alignment
- Price fit
- Popularity signals

This approach simulates AI-style recommendations while remaining lightweight, explainable, and fast.

> The system is intentionally designed to be extensible to future AI enhancements (LLMs, embeddings, or behavioural learning).

---

## 🎯 Business Value

Employees often waste valuable lunch time browsing or defaulting to the same places.

**MyFoodie solves this by:**

- ⏳ **Reducing decision time** → faster, more confident choices
- 🧘 **Improving wellbeing** → meals aligned with mood and dietary needs
- 🏪 **Supporting local businesses** → more consistent discovery
- 📈 **Enabling personalization** → foundation for AI-driven recommendations

This concept can be extended into food delivery platforms, workplace wellness tools, or multi-tenant SaaS products.

---

## 🛠 Tech Stack

- Node 25.8.2
- NPM 11.12.0
- Expo + React Native (TypeScript)
- Expo Router (navigation)
- react-native-maps (in-app map preview)
- expo-location (geolocation)
- Overpass API (OpenStreetMap) for nearby venues
- Geoapify autocomplete

### Core Logic

- Haversine distance + walking ETA
- Queue / preparation time heuristics
- Weighted scoring algorithm:
  - proximity
  - time-fit
  - dietary-fit
  - mood-fit
  - price-fit
  - popularity

### UI Architecture

- Reusable component system (ThemedButton, ThemedCard)
- Centralized theme (light/dark)
- Safe area handling via react-native-safe-area-context

---

## 📲 Running the App

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

⚠️ use Expo Go or simulator.

## 📸 Demo

(Insert screenshots or a short demo video here — simulator recording is fine)

## 🧩 Future Enhancements

- 🤖 LLM-powered recommendation explanations
- 🧠 Personalised user preferences (learning behaviour over time)
- 🌦 Weather-aware suggestions
- 👥 Team lunch coordination (shared session)
- 💾 AsyncStorage for saved preferences
- 🍽 Richer restaurant data (menus, images, pricing)

## 💡 Key Learnings

- Designing context-aware recommendation systems without ML
- Balancing UX simplicity with algorithmic decision-making
- Building scalable UI architecture with theming
- Structuring apps for future AI extensibility

## 👤 Author

Built with ❤️ by Alfons Caroles (aka Fonzie)
Frontend & Mobile Developer • 7+ years experience
(React, React Native, Next.js, TypeScript)
