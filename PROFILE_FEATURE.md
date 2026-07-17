# User Profile Feature

## Overview

This document describes the user profile feature implementation in Qwitter. The profile page allows users to view their personal statistics, manage their qweets, and edit their bio.

## Features

### Profile Page (`/profile`)

The profile page displays:

1. **Profile Header**
   - User avatar (120px)
   - Display name
   - Username (with @ prefix)
   - Bio (editable, max 160 characters)
   - Join date

2. **Profile Statistics**
   - **Total Qweets**: Count of all qweets posted by the user
   - **Likes Received**: Count of qweets that have been liked
   - **Photos**: Count of qweets with photo attachments

3. **User's Qweets Feed**
   - Displays all qweets from the current user
   - Ordered by date (newest first)
   - Includes all qweet features:
     - Text content
     - Photo display (if attached)
     - Like/unlike functionality
     - Delete functionality
     - Full-size photo viewer

4. **Edit Profile**
   - Modal dialog to edit bio
   - Character counter (160 max)
   - Save/Cancel actions

5. **Empty State**
   - Displayed when user has no qweets
   - Helpful message with call-to-action
   - Button to navigate to home page

## Technical Implementation

### Data Structure

#### Qweet Document (Firestore)
```javascript
{
  content: "Qweet text content",
  date: 1234567890,        // Unix timestamp
  liked: false,             // Boolean
  username: "danny__connell", // String (NEW)
  photoUrl: "https://..."   // Optional string
}
```

**Note**: The `username` field is now required for all new qweets to enable profile filtering.

#### Profile Data (Currently Hardcoded)
```javascript
{
  name: "Danny Connell",
  username: "danny__connell",
  avatar: "https://...",
  bio: "User bio text",
  joinDate: "January 2024"
}
```

**Future Enhancement**: Profile data will be stored in a `users` collection in Firestore when authentication is implemented.

### Firestore Query

The profile page uses a filtered query to fetch only the current user's qweets:

```javascript
db.collection('qweets')
  .where('username', '==', currentUser)
  .orderBy('date', 'desc')
  .onSnapshot(...)
```

**Important**: This query requires a composite index in Firestore:
- Field: `username` (Ascending)
- Field: `date` (Descending)

Firebase will automatically prompt you to create this index when you first access the profile page. Click the provided link to create it in the Firebase Console.

### Component Structure

```
PageProfile.vue
├── Profile Header
│   ├── Avatar
│   ├── User Info (name, username, bio, join date)
│   └── Edit Profile Button
├── Profile Statistics Cards
│   ├── Total Qweets
│   ├── Likes Received
│   └── Photos Posted
├── User's Qweets Feed
│   ├── Empty State (conditional)
│   └── Qweet List (conditional)
│       └── Qweet Items with actions
├── Edit Bio Dialog (modal)
└── Photo Viewer Dialog (modal)
```

### Navigation

- **Route**: `/profile`
- **Navigation Link**: Added to left sidebar in MainLayout
- **Icon**: `person` (Material Icons)

## User Experience

### Profile Statistics

Statistics are computed in real-time from the user's qweets:

- **Total Qweets**: `userQweets.length`
- **Likes Received**: Count of qweets where `liked === true`
- **Photos**: Count of qweets with `photoUrl` property

### Edit Bio Flow

1. User clicks "Edit Profile" button
2. Modal dialog opens with current bio pre-filled
3. User edits bio (max 160 characters with counter)
4. User clicks "Save" or "Cancel"
5. If saved, bio updates and success notification displays

**Note**: Currently bio changes are only stored in component state. Future implementation will save to Firestore users collection.

### Empty State

When a user has no qweets, the profile displays:
- Large dove icon (brand icon)
- "No qweets yet" heading
- Encouraging message
- "Create Your First Qweet" button linking to home page

## Styling

### Profile Header
- Gradient background: `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`
- Responsive layout with flexbox
- Large avatar (120px) for visual prominence

### Statistics Cards
- Three-column grid on desktop
- Single column on mobile
- Bordered cards with centered content
- Color-coded numbers:
  - Qweets: Primary blue
  - Likes: Pink
  - Photos: Purple

### Qweets Feed
- Consistent styling with home page feed
- Smooth transitions for add/remove animations
- Hover effects on photos

## Future Enhancements

### Authentication Integration
When Firebase Authentication is implemented:
- Replace hardcoded `currentUser` with authenticated user ID
- Store profile data in Firestore `users` collection
- Persist bio changes to database
- Add profile photo upload functionality

### Dynamic Profile Routes
Support viewing other users' profiles:
- Route: `/profile/:username`
- Display any user's profile and qweets
- Hide edit functionality for other users' profiles
- Add follow/unfollow functionality

### Additional Statistics
- Followers count
- Following count
- Qweets per day average
- Most liked qweet
- Account age

### Profile Customization
- Upload custom avatar
- Add cover photo
- Theme color selection
- Location and website fields

## Testing Checklist

- [ ] Navigate to profile page via sidebar
- [ ] Verify profile header displays correctly
- [ ] Check that statistics calculate accurately
- [ ] Create a new qweet and verify it appears in profile
- [ ] Test like/unlike functionality
- [ ] Test delete functionality
- [ ] Click "Edit Profile" and modify bio
- [ ] Verify bio character counter works
- [ ] Test photo viewer dialog
- [ ] Check empty state when no qweets exist
- [ ] Verify responsive design on mobile
- [ ] Test navigation between pages
- [ ] Confirm Firestore index is created

## Known Limitations

1. **Single User**: Currently hardcoded to one user (`danny__connell`)
2. **No Persistence**: Bio changes don't persist across sessions
3. **No Authentication**: No login/logout functionality
4. **Static Profile Data**: Name, avatar, and join date are hardcoded
5. **No User Collection**: Profile data not stored in Firestore

These limitations will be addressed when authentication is implemented.

## Dependencies

- **Firebase Firestore**: Database for qweets
- **Firebase Storage**: Photo storage
- **date-fns**: Date formatting (`formatDistance`)
- **Quasar Framework**: UI components and styling

## Related Files

- `src/pages/PageProfile.vue` - Profile page component
- `src/pages/PageHome.vue` - Updated to include username field
- `src/router/routes.js` - Added profile route
- `src/layouts/MainLayout.vue` - Added profile navigation link
- `src/boot/firebase.js` - Firebase configuration
