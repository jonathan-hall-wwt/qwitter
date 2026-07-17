# Qwitter (qwitter)

A Cross-Platrom Twitter Clone created with Quasar Framework, VueJS & Firebase

## Features

- ✅ Post qweets (tweets) with text content
- ✅ Like/unlike qweets
- ✅ Delete qweets
- ✅ Real-time updates with Firebase
- ✅ **Photo uploads** - Attach photos to your qweets
- ✅ **Trending Qashtags** - Discover trending topics and filter by hashtags
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ Cross-platform support (Web, Desktop, iOS, Android)

## New: Trending Qashtags Feature 🔥

Qwitter now includes a comprehensive hashtag system called "Qashtags"!

### What's Included:
- **Automatic Detection**: Hashtags in your qweets are automatically detected and made clickable
- **Qashtag Pages**: Click any hashtag to see all qweets tagged with it
- **Trending Sidebar**: Real-time trending qashtags showing the top 10 most popular topics
- **Smart Filtering**: Find qweets by topic instantly

### How to Use:
1. Add hashtags to your qweets: "Loving #JavaScript and #VueJS!"
2. Click any hashtag to see related qweets
3. Check the trending sidebar to discover popular topics
4. Explore conversations by topic

See [TRENDING_QASHTAGS_FEATURE.md](TRENDING_QASHTAGS_FEATURE.md) for detailed documentation.

## Setup Firebase

### Firestore Database
- Create a new Firebase project named Qwitter
- Create a Web App named Qwitter
- Copy the config from the code sample that appears and add it to src/boot/firebase.js
- Create a Cloud Firestore database - make sure you choose "Start in test mode"

### Firebase Storage (for photo uploads)
- In your Firebase Console, navigate to Storage
- Click "Get Started"
- Choose "Start in test mode" for development
- Select a Cloud Storage location

### Firestore Index (for Qashtags)
When you first use the qashtag feature, Firebase will prompt you to create a composite index:
- Collection: `qweets`
- Fields: `qashtags` (Arrays) + `date` (Descending)

Simply click the link provided in the browser console to create the index automatically.

See [PHOTO_FEATURE.md](PHOTO_FEATURE.md) for detailed information about the photo upload feature.

## Install the dependencies
```bash
npm install
```

## Web Version

### Start  in development mode
```bash
quasar dev
```

### Build for production
```bash
quasar build
```

## Desktop Version (Electron)

### Start  in development mode
```bash
quasar dev -m electron
```

### Build for production
To build for different platforms, change the `electron > packager > platform` setting in `quasar.conf.js` to `win32`, `darwin`, `mas` or `linux` 
```bash
quasar build -m electron
```

## iOS Version (Cordova)

### Install Cordova globally
```bash
npm install -g cordova
```
or
```bash
sudo npm install -g cordova
```

### Install Xcode

[Install Xcode](https://developer.apple.com/download/more/)

### Start  in development mode
```bash
quasar dev -m cordova -T ios
```

### Start on other Simulator Devices
```bash
cd src-cordova
cordova run ios --list
cd ..
quasar dev -m cordova -T ios -e "iPhone-12, 14.3"
```

### Build for production
```bash
quasar build -m cordova -T ios
```

## Android Version (Cordova)

### Install Cordova globally
```bash
npm install -g cordova
```
or
```bash
sudo npm install -g cordova
```

### Follow all steps on Quasar site

[Follow all steps on Quasar site](https://quasar.dev/quasar-cli/developing-cordova-apps/preparation#Android-setup)

### Launch Android Virtual Device
Android Studio > Configure > AVD Manager > Launch an AVD

### Start  in development mode
```bash
quasar dev -m cordova -T android
```

### Build for production
```bash
quasar build -m cordova -T android
```
