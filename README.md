# Qwitter

A cross-platform Twitter clone built with Quasar Framework, Vue.js, and Firebase.

## Quick Start

### Prerequisites
- Node.js and npm
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jonathan-hall-wwt/qwitter.git
cd qwitter
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project
   - Create a Web App in your Firebase project
   - Copy the Firebase config to `src/boot/firebase.js`
   - Create a Cloud Firestore database in test mode

### Development

Run the development server:
```bash
quasar dev
```

### Build

Build for production:
```bash
quasar build
```

## Platform Support

- **Web**: Default platform
- **Desktop**: Electron (`quasar dev -m electron`)
- **iOS**: Cordova (`quasar dev -m cordova -T ios`)
- **Android**: Cordova (`quasar dev -m cordova -T android`)

For detailed platform-specific instructions, see the [Quasar documentation](https://quasar.dev).

## License

See [LICENSE](LICENSE) file for details.
