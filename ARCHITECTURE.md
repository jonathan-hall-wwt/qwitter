# Photo Upload Feature - Architecture Diagram

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  New Qweet Form                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Text Input: "What's happening?"                   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  📷 Add Photo Button                               │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │
│  │  │  Photo Preview (if selected)                       │  │
│  │  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  │  [Image Preview]                      [X]    │  │  │
│  │  │  └──────────────────────────────────────────────┘  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  [Qweet Button]                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Qweet Feed                                              │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  @user • 2 hours ago                               │  │  │
│  │  │  Check out this photo!                             │  │  │
│  │  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  │  [Photo Display - 16:9 ratio]                │  │  │
│  │  │  └──────────────────────────────────────────────┘  │  │
│  │  │  💬 🔄 ❤️ 🗑️                                        │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PageHome.vue (Vue Component)                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Data:                                                   │  │
│  │  • newQweetContent                                       │  │
│  │  • newQweetPhoto                                         │  │
│  │  • newQweetPhotoPreview                                  │  │
│  │  • isUploading                                           │  │
│  │  • qweets[]                                              │  │
│  │                                                          │  │
│  │  Methods:                                                │  │
│  │  • handlePhotoUpload(event)                              │  │
│  │  • removePhoto()                                         │  │
│  │  • addNewQweet() ──────────────────┐                     │  │
│  │  • deleteQweet(qweet) ─────────────┤                     │  │
│  │  • showPhotoDialog(url)            │                     │  │
│  └────────────────────────────────────┼─────────────────────┘  │
│                                       │                         │
└───────────────────────────────────────┼─────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FIREBASE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────┐  ┌──────────────────────────┐    │
│  │  Firebase Storage        │  │  Cloud Firestore         │    │
│  │                          │  │                          │    │
│  │  qweet-photos/           │  │  qweets/                 │    │
│  │  ├─ 123_photo1.jpg       │  │  ├─ doc1                 │    │
│  │  ├─ 124_photo2.png       │  │  │  ├─ content          │    │
│  │  └─ 125_photo3.jpg       │  │  │  ├─ date             │    │
│  │                          │  │  │  ├─ liked            │    │
│  │  Operations:             │  │  │  └─ photoUrl ────────┼────┤
│  │  • upload(file)          │  │  │                      │    │
│  │  • getDownloadURL()      │  │  └─ doc2               │    │
│  │  • delete(ref)           │  │     ├─ content         │    │
│  └──────────────────────────┘  │     ├─ date            │    │
│                                 │     ├─ liked           │    │
│                                 │     └─ photoUrl        │    │
│                                 └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Photo Upload Flow
```
User selects photo
       │
       ▼
handlePhotoUpload()
       │
       ├─ Validate file type
       ├─ Store file in memory
       └─ Create preview URL
       │
       ▼
User clicks "Qweet"
       │
       ▼
addNewQweet()
       │
       ├─ Upload to Storage ──► Firebase Storage
       │                         (qweet-photos/timestamp_filename)
       │                                │
       ├─ Get download URL ◄────────────┘
       │
       ├─ Create qweet object
       │  (content, date, liked, photoUrl)
       │
       └─ Save to Firestore ──► Cloud Firestore
                                 (qweets collection)
       │
       ▼
Clean up preview URL
       │
       ▼
Show success notification
```

### Photo Deletion Flow
```
User clicks delete
       │
       ▼
deleteQweet(qweet)
       │
       ├─ Get photoUrl from qweet
       │
       ├─ Delete from Storage ──► Firebase Storage
       │                           (delete photo file)
       │
       └─ Delete from Firestore ──► Cloud Firestore
                                     (delete qweet doc)
       │
       ▼
Show success notification
```

### Photo Display Flow
```
Component mounted
       │
       ▼
Firestore listener
       │
       ▼
Receive qweet data
       │
       ├─ Has photoUrl?
       │      │
       │      ├─ Yes ──► Display photo in feed
       │      │          (16:9 aspect ratio)
       │      │
       │      └─ No ──► Display text only
       │
       ▼
User clicks photo
       │
       ▼
showPhotoDialog()
       │
       ▼
Display full-size photo
(in modal dialog)
```

## Component Structure

```
PageHome.vue
├── Template
│   ├── New Qweet Form
│   │   ├── Text Input
│   │   ├── Photo Upload Button
│   │   ├── Photo Preview (conditional)
│   │   └── Qweet Button
│   │
│   ├── Qweet Feed
│   │   └── Qweet Items (v-for)
│   │       ├── Avatar
│   │       ├── User Info
│   │       ├── Content
│   │       ├── Photo (conditional)
│   │       └── Action Buttons
│   │
│   └── Photo Dialog (modal)
│       └── Full-size Image
│
├── Script
│   ├── Data Properties
│   ├── Computed Properties
│   ├── Methods
│   │   ├── Photo Handling
│   │   ├── Qweet CRUD
│   │   └── UI Interactions
│   └── Lifecycle Hooks
│
└── Style
    ├── Form Styles
    ├── Feed Styles
    └── Photo Styles
```

## State Management

```
Component State
├── newQweetContent: String
│   └── Text content of new qweet
│
├── newQweetPhoto: File | null
│   └── Selected photo file
│
├── newQweetPhotoPreview: String | null
│   └── Blob URL for preview
│
├── isUploading: Boolean
│   └── Upload in progress flag
│
├── photoDialog: Boolean
│   └── Full-size photo dialog visibility
│
├── selectedPhoto: String | null
│   └── URL of photo in dialog
│
└── qweets: Array
    └── List of qweet objects
        ├── id: String
        ├── content: String
        ├── date: Number
        ├── liked: Boolean
        └── photoUrl: String (optional)
```

## Error Handling

```
Try-Catch Blocks
├── addNewQweet()
│   ├── Storage upload errors
│   ├── Firestore write errors
│   └── Network errors
│
└── deleteQweet()
    ├── Storage deletion errors
    ├── Firestore deletion errors
    └── Network errors

All errors ──► Quasar Notify
                (User-friendly messages)
```

## Security Considerations

```
Firebase Storage Rules
├── Read: Public (anyone can view photos)
└── Write/Delete: Authenticated users only

Firestore Rules
├── Read: Public
└── Write/Delete: Authenticated users only
    (Note: Current implementation uses test mode)
```

## Performance Optimizations

```
Current Implementation
├── ✅ Blob URLs for instant preview
├── ✅ Async/await for non-blocking uploads
├── ✅ Memory cleanup (URL.revokeObjectURL)
└── ✅ Firebase CDN for photo delivery

Future Optimizations
├── 🔄 Image compression before upload
├── 🔄 Lazy loading for feed images
├── 🔄 Progressive image loading
└── 🔄 Multiple image sizes (responsive)
```
