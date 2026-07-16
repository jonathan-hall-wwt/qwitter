# Qwitter

A cross-platform Twitter clone built with Quasar Framework, Vue.js, and Firebase.

## Features

- 📱 Cross-platform support (Web, Desktop, iOS, Android)
- 🔥 Firebase backend integration
- ⚡ Built with Quasar Framework and Vue.js
- 💻 Electron desktop app
- 📲 Cordova mobile apps

## Quick Start

### Prerequisites

- Node.js >= 10.18.1
- npm >= 6.13.4 or yarn >= 1.21.1

### Installation

```bash
npm install
```

### Firebase Setup

1. Create a new Firebase project named "Qwitter"
2. Create a Web App named "Qwitter" in your Firebase project
3. Copy the Firebase config and add it to `src/boot/firebase.js`
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

**iOS (Cordova):**
```bash
quasar dev -m cordova -T ios
```

**Android (Cordova):**
```bash
quasar dev -m cordova -T android
```

### Production Build

**Web:**
```bash
quasar build
```

**Desktop (Electron):**
```bash
quasar build -m electron
```

**iOS (Cordova):**
```bash
quasar build -m cordova -T ios
```

**Android (Cordova):**
```bash
quasar build -m cordova -T android
```

## Platform-Specific Setup

### Desktop (Electron)

To build for different platforms, change the `electron > packager > platform` setting in `quasar.conf.js` to:
- `win32` (Windows)
- `darwin` (macOS)
- `mas` (Mac App Store)
- `linux` (Linux)

### iOS (Cordova)

1. Install Cordova globally:
   ```bash
   npm install -g cordova
   ```

2. Install [Xcode](https://developer.apple.com/download/more/)

3. List available simulators:
   ```bash
   cd src-cordova
   cordova run ios --list
   cd ..
   ```

4. Run on specific simulator:
   ```bash
   quasar dev -m cordova -T ios -e "iPhone-12, 14.3"
   ```

### Android (Cordova)

1. Install Cordova globally:
   ```bash
   npm install -g cordova
   ```

2. Follow the [Quasar Android setup guide](https://quasar.dev/quasar-cli/developing-cordova-apps/preparation#Android-setup)

3. Launch Android Virtual Device:
   - Open Android Studio
   - Navigate to Configure > AVD Manager
   - Launch an AVD

## License

See [LICENSE](LICENSE) file for details.
