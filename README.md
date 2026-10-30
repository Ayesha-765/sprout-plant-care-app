# 🌱 Sprout: Plant Care Tracker

A mobile app that helps you keep track of your plants and tells you which ones need water today. Built with **Expo**, **React Native** and **TypeScript** as a hands-on project for learning mobile development.



## Features

- **My Garden:** see all your plants and how many need water today
- **Discover:** search and filter a plant catalog by difficulty, then add plants to your garden
- **Add a plant:** custom form with icon picker, watering interval, and light level, with input validation
- **Plant details:** open any plant to mark it as watered or remove it (with confirmation)
- **Profile:** garden stats, dark mode toggle, and a "clear my garden" option
- **Light and dark themes** with a custom colour palette

## Tech Stack

- [Expo](https://expo.dev) (managed workflow)
- React Native + TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) (file-based navigation)
- React Context API for global state
- `@expo/vector-icons` for tab icons

## Project Structure

```
src/
├── app/                    # Screens (file-based routing)
│   ├── _layout.tsx         # Root stack + providers
│   ├── (tabs)/
│   │   ├── _layout.tsx     # Tab bar
│   │   ├── index.tsx       # Garden
│   │   ├── explore.tsx     # Discover
│   │   ├── add.tsx         # Add a plant
│   │   └── profile.tsx     # Profile
│   ├── plant
│   │   └── plant/[id].tsx  # Plant details (dynamic route)
├── components/             # AppButton, Chip, PlantCard
├── constants/colors.ts     # Light and dark palettes
├── context/                # PlantsContext, ThemeContext
└── data/catalog.ts         # Sample plant catalog
```

## How Navigation Works

- The root layout wraps the app in a **Stack** and the global providers.
- The `(tabs)` group renders a **bottom tab bar** with four tabs.
- Tapping a plant calls `router.push('/plant/<id>')`, which opens the dynamic route `plant/[id].tsx`. The `id` is read with `useLocalSearchParams`.

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Ayesha-765/sprout-plant-care-app.git
cd sprout-plant-care-app

# 2. Install dependencies
npm install

# 3. Start the dev server
npx expo start
```

Then scan the QR code with the **Expo Go** app on your phone, or press `a` for an Android emulator or `i` for an iOS simulator.

## What I Practiced

- Core components: `View`, `Text`, `Pressable`, `TextInput`, `FlatList`, `ScrollView`, `Switch`
- Styling with `StyleSheet`, flexbox, safe areas, shadows and elevation
- Reusable, typed components and props
- State with `useState` and shared state with Context
- Expo Router: tabs, stack, and dynamic routes
- Keyboard handling, form validation, and confirmation dialogs

## Roadmap

- [ ] Persist plants with AsyncStorage
- [ ] Replace emoji with plant photos using `Image`
- [ ] Edit plant details in a modal
- [ ] Watering reminders with notifications

## Author

**Ayesha**: [GitHub](https://github.com/Ayesha-765/)
