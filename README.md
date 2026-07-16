# Qwitter

A cross-platform Twitter clone built with Quasar Framework, Vue.js, and Firebase.

## Features

- Web application
- Desktop app (Electron)
- Mobile apps (iOS & Android via Cordova)

## Quick Start

### Prerequisites

- Node.js >= 10.18.1
- npm >= 6.13.4

### Installation

```bash
npm install
```

### Firebase Setup

1. Create a new Firebase project
2. Create a Web App in your Firebase project
3. Copy the Firebase config to `src/boot/firebase.js`
4. Create a Cloud Firestore database in test mode

### Development

```bash
# Web
quasar dev

# Desktop
quasar dev -m electron

# iOS (requires Xcode)
quasar dev -m cordova -T ios

# Android (requires Android Studio)
quasar dev -m cordova -T android
```

### Build for Production

```bash
# Web
quasar build

# Desktop
quasar build -m electron

# iOS
quasar build -m cordova -T ios

# Android
quasar build -m cordova -T android
```

## License

See [LICENSE](LICENSE) file for details.
