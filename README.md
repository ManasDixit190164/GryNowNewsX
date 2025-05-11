# GryNowNews

A React Native mobile application for news consumption, built with modern technologies and best practices.

APK Link: https://www.jioaicloud.com/l/?u=Faolw7DpP6I3xvTl33nsVpBfngxeo5_XszFoK6xd3vZYAG-5hA633tjzvBv0qlKvXPz

## 🚀 Technologies Used

### Core Technologies
- React Native (v0.79.2)
- TypeScript
- React Navigation (v7.x)

### Key Dependencies
- **@react-native-async-storage/async-storage**: For local data persistence
- **@react-navigation/bottom-tabs**: For bottom tab navigation
- **@react-navigation/native-stack**: For stack navigation
- **axios**: For making HTTP requests
- **react-native-fast-image**: For optimized image loading
- **react-native-vector-icons**: For UI icons
- **react-native-webview**: For rendering web content

## 📁 Project Structure

```
src/
├── assets/         # Static assets like images, fonts, etc.
├── components/     # Reusable UI components
├── context/        # React Context providers
├── features/       # Feature-specific components and logic
├── navigation/     # Navigation configuration
├── services/       # API services and utilities
└── theme/          # Theme configuration and styling
```

## 🛠️ Setup Instructions

1. **Prerequisites**
   - Node.js >= 18
   - React Native development environment setup
   - Xcode (for iOS development)
   - Android Studio (for Android development)

2. **Installation**
   ```bash
   # Install dependencies
   npm install

   # For iOS, install pods
   cd ios && pod install && cd ..
   ```

3. **Running the App**
   ```bash
   # Start Metro bundler
   npm start

   # Run on iOS
   npm run ios

   # Run on Android
   npm run android
   ```

## 🔧 Development

- **Linting**: `npm run lint`
- **Testing**: `npm test`

## 📱 Features

- News feed with modern UI
- Bottom tab navigation
- WebView integration for article reading
- Local storage for offline capabilities
- Optimized image loading
- Type-safe development with TypeScript
