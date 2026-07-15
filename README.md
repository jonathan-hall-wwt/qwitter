# Qwitter

A cross-platform Twitter clone built with Quasar Framework, Vue.js, and Firebase.

## Features

- 📱 Cross-platform support (Web, Desktop, iOS, Android)
- 🔥 Firebase backend integration
- ⚡ Built with Quasar Framework and Vue.js

## Quick Start

### Prerequisites

- Node.js >= 10.18.1
- npm >= 6.13.4

### Installation

```bash
npm install
```

### Firebase Setup

1. Create a new Firebase project named "Qwitter"
2. Create a Web App in your Firebase project
3. Copy the Firebase config to `src/boot/firebase.js`
4. Create a Cloud Firestore database in test mode

### Development

**Web:**
```bash
quasar dev
```

**Desktop (Electron):**
```bash
quasar dev -m electron
```

**Mobile (Cordova):**
```bash
# iOS
quasar dev -m cordova -T ios

# Android
quasar dev -m cordova -T android
```

### Build for Production

```bash
# Web
quasar build

# Desktop
quasar build -m electron

# Mobile
quasar build -m cordova -T ios
quasar build -m cordova -T android
```

## License

See [LICENSE](LICENSE) file for details.
