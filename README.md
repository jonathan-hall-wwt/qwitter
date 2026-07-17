# 🐦 Qwitter - Because "Tweet" Was Taken

> **Warning:** This app may cause excessive scrolling, compulsive qweeting, and an irresistible urge to share your thoughts with the world. Side effects include increased emoji usage and hashtag addiction.

## 🎭 What Even Is This?

Qwitter is a cross-platform Twitter clone that lets you shout into the void, but with style! Built with the power of Quasar Framework, Vue.js, and Firebase, it's like Twitter's cooler, more experimental cousin who learned to code during the pandemic.

### 🎪 The Greatest Features Ever Assembled

- 🗣️ **Qweet Your Heart Out** - Post your deepest thoughts, hottest takes, and breakfast photos
- ❤️ **Like Button Goes Brrr** - Smash that like button like there's no tomorrow
- 🗑️ **Instant Regret Button** - Delete your qweets when you realize what you've done
- 📸 **Photo Evidence** - Attach photos because sometimes words just aren't enough
- ⚡ **Real-Time Magic** - Watch qweets appear faster than you can say "Firebase is awesome"
- 📱 **Literally Everywhere** - Web, Desktop, iOS, Android - we've got more platforms than a politician
- #️⃣ **Hashtag Everything** - Because #ThisIsHowWeCommunicateNow
- 🔥 **Trending Topics** - See what's hot (or at least what people are qweeting about)
- 👤 **Profile Pages** - Admire your qweet collection like it's a museum

## 🚀 Getting Started (The Fun Part)

### Step 1: Firebase Setup (The "Necessary Evil")

#### Firestore Database
1. Create a Firebase project (name it "Qwitter" or "MyAwesomeApp" - we don't judge)
2. Create a Web App (also called "Qwitter" for consistency, or go wild)
3. Copy that config code they give you and paste it into `src/boot/firebase.js`
4. Create a Cloud Firestore database in "test mode" (because we live dangerously)

#### Firebase Storage (For Your Cat Photos)
1. Navigate to Storage in Firebase Console
2. Click "Get Started" (it's the big button, you can't miss it)
3. Choose "Start in test mode" (again, living on the edge)
4. Pick a location (anywhere but the Bermuda Triangle)

📚 **Pro Tip:** Check out [PHOTO_FEATURE.md](PHOTO_FEATURE.md) for the full photo upload saga.

### Step 2: Install Dependencies (The Waiting Game)

```bash
npm install
```

☕ Go make coffee. This might take a minute. Or ten.

## 🎮 Running This Bad Boy

### 🌐 Web Version (For the Browser Dwellers)

**Development Mode:**
```bash
quasar dev
```
*Now you're cooking with gas!*

**Production Build:**
```bash
quasar build
```
*Ship it! 🚢*

### 🖥️ Desktop Version (For the Electron Enthusiasts)

**Development Mode:**
```bash
quasar dev -m electron
```

**Production Build:**
```bash
quasar build -m electron
```

💡 **Platform Switching:** Edit `electron > packager > platform` in `quasar.conf.js` to build for:
- `win32` - Windows (for your gaming PC)
- `darwin` - macOS (for your overpriced laptop)
- `mas` - Mac App Store (for your *really* overpriced laptop)
- `linux` - Linux (for the cool kids)

### 📱 iOS Version (For the Apple Aficionados)

**Prerequisites:**
```bash
npm install -g cordova
# or if you like living dangerously:
sudo npm install -g cordova
```

Also, you'll need [Xcode](https://developer.apple.com/download/more/) (RIP your hard drive space)

**Development Mode:**
```bash
quasar dev -m cordova -T ios
```

**Simulator Shenanigans:**
```bash
cd src-cordova
cordova run ios --list
cd ..
quasar dev -m cordova -T ios -e "iPhone-12, 14.3"
```

**Production Build:**
```bash
quasar build -m cordova -T ios
```

### 🤖 Android Version (For the Green Robot Gang)

**Prerequisites:**
```bash
npm install -g cordova
# or with great power:
sudo npm install -g cordova
```

**Setup:** Follow [all the steps on the Quasar site](https://quasar.dev/quasar-cli/developing-cordova-apps/preparation#Android-setup) (yes, ALL of them)

**Launch Your Virtual Device:**
Android Studio → Configure → AVD Manager → Launch an AVD (it's like launching a rocket, but slower)

**Development Mode:**
```bash
quasar dev -m cordova -T android
```

**Production Build:**
```bash
quasar build -m cordova -T android
```

## 🎨 Architecture Highlights

Want to know how the sausage is made? Check out:
- 📐 [ARCHITECTURE.md](ARCHITECTURE.md) - The blueprint
- 🚀 [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Don't deploy without this
- 📝 [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - What we actually built

## 🤝 Contributing

Found a bug? Want to add a feature? Have a brilliant idea? 

1. Fork it 🍴
2. Create your feature branch 🌿
3. Commit your changes 💾
4. Push to the branch 🚀
5. Open a Pull Request 🎉

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. (Translation: Do whatever you want, just don't sue us.)

## 🎉 Final Words

Remember: With great qweeting power comes great qweeting responsibility. Use this app wisely, qweet kindly, and may your timeline always be interesting (but not *too* interesting).

Now go forth and qweet! 🐦✨

---

*Made with ❤️, ☕, and an unhealthy amount of Stack Overflow*
