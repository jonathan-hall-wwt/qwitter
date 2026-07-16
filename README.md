# Qwitter

A cross-platform Twitter clone built with Quasar Framework, Vue.js, and Firebase.

## Tech Stack

### Frontend

- **[Quasar Framework](https://quasar.dev/)** (v1.x) - High-performance Material Design component framework
  - Single codebase for multiple platforms (Web, Desktop, Mobile)
  - Auto-import of components and directives
  - Built-in responsive design utilities
  - Material Icons and FontAwesome 5 icon sets
  
- **[Vue.js](https://vuejs.org/)** (v2.x) - Progressive JavaScript framework
  - Component-based architecture
  - Reactive data binding
  - Vue Router for navigation (hash mode)
  
### Backend & Database

- **[Firebase](https://firebase.google.com/)** (v8.x) - Backend-as-a-Service platform
  - **Cloud Firestore** - NoSQL document database for real-time data
  - **Firebase Authentication** - User authentication and authorization
  - **Firebase Hosting** - Static web hosting (optional)

### Cross-Platform Support

- **[Electron](https://www.electronjs.org/)** (v9.x) - Desktop application framework
  - Native desktop apps for Windows, macOS, and Linux
  - Node.js integration enabled
  - Electron Packager for building distributions
  
- **[Apache Cordova](https://cordova.apache.org/)** - Mobile application framework
  - Native iOS and Android apps from web codebase
  - Access to native device APIs

### Styling & UI

- **[Sass](https://sass-lang.com/)** - CSS preprocessor for enhanced styling
- **[PostCSS](https://postcss.org/)** - CSS transformation and optimization
- **Material Design** - Google's design system for consistent UI/UX
- **Roboto Font** - Primary typeface
- **Material Icons & FontAwesome 5** - Comprehensive icon libraries

### Build Tools & Development

- **Webpack** - Module bundler (via Quasar CLI)
- **Babel** - JavaScript transpiler for ES6+ support
- **[date-fns](https://date-fns.org/)** (v2.x) - Modern date utility library
- **Electron DevTools** - Debugging tools for Electron apps
- **Hot Module Replacement** - Fast development with live reloading

### Browser Support

Supports modern browsers including:
- Chrome (last 10 versions)
- Firefox (last 10 versions)
- Safari (last 7 versions)
- Edge (last 4 versions)
- Mobile browsers (iOS, Android, Chrome Android, Firefox Android)

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
