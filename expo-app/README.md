# Insightflow AI Trading - Expo App

This is the mobile app version of Insightflow AI Trading platform built with Expo.

## Setup Instructions

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Create a `.env` file in the root of the expo-app directory with the following variables:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Install Expo CLI globally (if not already installed):
```bash
npm install -g expo-cli
```

4. Start the development server:
```bash
npx expo start
```

## Project Structure

- `app/` - Main screens using the Expo Router file-based routing
- `components/` - Reusable UI components
- `lib/` - Utility functions and services
- `store/` - State management with Zustand
- `api/` - API functions for data fetching
- `assets/` - Static assets like images and fonts

## Known Issues

1. TypeScript errors with React Native types - These can be fixed by installing the proper types:
```bash
npm install @types/react-native --legacy-peer-deps
```

2. Path alias issues - Make sure the babel.config.js and tsconfig.json are properly configured for path aliases.

3. Lucide React Native icons - Make sure to use the `color` prop instead of `stroke` for icon colors.

## Dependencies

- Expo SDK
- React Native
- Supabase
- Zustand
- Lucide React Native
- React Native Safe Area Context
- Expo Router

## Development Notes

- Use StyleSheet for styling components instead of className/Tailwind
- For navigation, use Expo Router's navigation functions
- For authentication, use the Supabase client from lib/supabase.ts
- The app uses a mobile-optimized version of the web app's components

## Features

- **Authentication** - Secure login and registration with Supabase
- **Dashboard** - Customizable widgets with performance metrics and market insights
- **Markets** - Real-time price data, watchlists, and AI-generated trading setups
- **Strategy Builder** - Create and manage trading strategies with AI assistance
- **Trading Journal** - Log and analyze trades with AI reflection
- **Crypto Payments** - Integrated crypto payment system for subscriptions
- **Multi-language Support** - i18n integration for multiple languages

## Project Structure

```
expo-app/
  ├── app/                      # Expo Router screens and navigation
  │   ├── (auth)/               # Authentication screens
  │   ├── (onboarding)/         # Onboarding flow screens
  │   ├── (tabs)/               # Main tab screens
  │   ├── market/               # Market detail screens
  │   ├── strategy/             # Strategy related screens
  │   └── _layout.tsx           # Root layout with providers
  ├── api/                      # API integration layer
  ├── components/               # Reusable UI components
  │   ├── dashboard/            # Dashboard specific components
  │   ├── markets/              # Markets specific components
  │   ├── strategy/             # Strategy specific components
  │   └── wallet/               # Payment and wallet components
  ├── contexts/                 # React contexts
  ├── hooks/                    # Custom React hooks
  ├── lib/                      # Utility functions and libraries
  │   └── supabase.ts           # Supabase client configuration
  ├── store/                    # Global state management with Zustand
  ├── types/                    # TypeScript type definitions
  └── scripts/                  # Helper scripts for development
```

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/insightflow-mobile.git
cd insightflow-mobile/expo-app
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
npm run setup-env
```

4. Start the development server

```bash
npm start
# or
yarn start
```

5. Run on iOS or Android

```bash
# iOS
npm run ios
# Android
npm run android
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

### Synchronizing with Web Config

To sync configuration from the web app:

```bash
npm run sync-config
```

### Adding New Components

Place new components in the appropriate directory under `components/`. Follow the existing naming conventions and structure.

### Translations

Add new translations in the `i18n` directory. The app currently supports English, Spanish, and French.

### Styling

This project uses NativeWind (Tailwind CSS for React Native) for styling. Configure the theme in `tailwind.config.js`.

## Testing

Run tests using Jest:

```bash
npm test
```

## Building for Production

### Build for iOS

```bash
eas build --platform ios
```

### Build for Android

```bash
eas build --platform android
```

## Deployment

Follow the Expo Application Services (EAS) documentation for deploying to app stores:

```bash
eas submit --platform ios
eas submit --platform android
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. 