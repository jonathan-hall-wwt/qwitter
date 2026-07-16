# Photo Upload Feature for Qweets

## Overview
This feature allows users to attach photos to their qweets (tweets), enhancing the visual experience of the Qwitter application.

## Features Implemented

### 1. Photo Upload
- **Add Photo Button**: A camera icon button appears below the qweet input field
- **File Selection**: Users can click the button to select an image from their device
- **Supported Formats**: All standard image formats (jpg, png, gif, etc.)

### 2. Photo Preview
- **Live Preview**: Selected photos are displayed as a preview before posting
- **Remove Option**: Users can remove the photo by clicking the X button on the preview
- **Aspect Ratio**: Photos are displayed in a 16:9 aspect ratio for consistency

### 3. Photo Storage
- **Firebase Storage**: Photos are uploaded to Firebase Storage
- **Unique Naming**: Each photo is stored with a timestamp-based unique filename
- **Organization**: Photos are stored in a `qweet-photos/` folder

### 4. Photo Display
- **Feed Display**: Photos appear in the qweet feed below the text content
- **Clickable**: Users can click on photos to view them in full size
- **Modal View**: Full-size photos open in a dialog/modal overlay
- **Responsive**: Photos adapt to different screen sizes

### 5. Photo Management
- **Deletion**: When a qweet is deleted, its associated photo is also removed from storage
- **Loading States**: Upload progress is indicated with a loading spinner
- **Error Handling**: User-friendly notifications for success and error states

## Technical Implementation

### Files Modified

#### 1. `src/boot/firebase.js`
- Added Firebase Storage import
- Exported storage instance for use in components

#### 2. `src/pages/PageHome.vue`
- Added photo upload UI components
- Implemented photo selection and preview logic
- Added photo upload to Firebase Storage
- Updated qweet creation to include photo URLs
- Enhanced qweet deletion to remove photos from storage
- Added photo dialog for full-size viewing
- Added loading and notification states

### Key Functions

#### `handlePhotoUpload(event)`
Handles file selection and creates a preview URL

#### `removePhoto()`
Removes the selected photo and cleans up preview URL

#### `addNewQweet()`
Enhanced to:
- Upload photo to Firebase Storage
- Get download URL
- Save qweet with photo URL to Firestore

#### `deleteQweet(qweet)`
Enhanced to:
- Delete photo from Firebase Storage
- Delete qweet from Firestore

#### `showPhotoDialog(photoUrl)`
Opens a modal to display the photo in full size

## Firebase Setup Requirements

### Storage Rules
To use this feature, you need to configure Firebase Storage rules. Add the following to your Firebase Storage rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /qweet-photos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

**Note**: For development/testing, you can use more permissive rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Enable Firebase Storage
1. Go to your Firebase Console
2. Navigate to Storage in the left sidebar
3. Click "Get Started"
4. Choose your security rules (start in test mode for development)
5. Select a Cloud Storage location

## Usage

### Adding a Photo to a Qweet
1. Type your qweet content in the text field
2. Click the image icon button below the text field
3. Select an image from your device
4. Preview the image (optional: remove it by clicking the X)
5. Click "Qweet" to post with the photo

### Viewing Photos
- Photos appear in the feed below the qweet text
- Click on any photo to view it in full size
- Click "Close" or outside the modal to dismiss

### Removing a Qweet with Photo
- Click the trash icon on any qweet
- Both the qweet and its photo will be deleted

## UI/UX Enhancements

### Visual Design
- Rounded corners (16px border-radius) for modern look
- Hover effect on photos (slight opacity change)
- Consistent 16:9 aspect ratio for all photos
- Smooth transitions and animations

### User Feedback
- Loading spinner during upload
- Success notification when qweet is posted
- Error notifications if something goes wrong
- Disabled state for buttons during upload

### Accessibility
- Tooltips on buttons
- Clear visual feedback for all actions
- Keyboard-accessible file input

## Future Enhancements

Potential improvements for future versions:
- Multiple photo uploads (up to 4 photos per qweet)
- Image compression before upload
- Drag-and-drop photo upload
- Photo editing (crop, filters, etc.)
- Video support
- GIF support
- Progress bar for large uploads
- Image optimization for different screen sizes

## Browser Compatibility

This feature uses standard HTML5 file input and modern JavaScript APIs:
- File API for file selection
- URL.createObjectURL for preview
- Firebase Storage SDK for uploads

Compatible with all modern browsers as specified in package.json browserslist.
