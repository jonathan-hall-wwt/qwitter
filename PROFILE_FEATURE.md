# User Profile Feature

## Overview

The User Profile feature allows users to view dedicated profile pages showing a user's qweets, statistics, and bio information. This feature enhances the social aspect of Qwitter by enabling users to explore individual user content and activity.

## Features

### Profile Page Components

1. **Profile Header**
   - User avatar (120px size for prominent display)
   - Display name
   - Username (with @ prefix)
   - Bio/description
   - User statistics:
     - Total qweets count
     - Total likes received

2. **User Qweet Feed**
   - Displays all qweets from the specific user
   - Ordered by date (newest first)
   - Shows full qweet content including:
     - Text content
     - Photos (if attached)
     - Timestamp (relative format)
     - Like status
   - Interactive elements:
     - Like/unlike button
     - Delete button (only visible on own profile)
     - Photo viewer for full-size images

3. **Empty State**
   - Friendly message when user has no qweets
   - Different messaging for own profile vs. other users

### Navigation

- **Sidebar Navigation**: Profile link added to main navigation menu
- **Clickable Usernames**: Usernames in the home feed are clickable and navigate to the user's profile
- **Clickable Avatars**: User avatars in the home feed are clickable and navigate to the user's profile
- **Route**: `/profile/:username` - Dynamic route supporting any username

### User Experience Enhancements

- **Hover Effects**: Usernames show underline on hover to indicate they're clickable
- **Cursor Changes**: Pointer cursor on interactive elements (avatars, usernames)
- **Smooth Transitions**: Fade animations for qweet list updates
- **Responsive Design**: Profile layout adapts to mobile, tablet, and desktop screens

## Technical Implementation

### Data Structure

Qweets now include a `username` field:
```javascript
{
  content: "Qweet text content",
  date: 1234567890,
  liked: false,
  username: "danny__connell",
  photoUrl: "https://..." // optional
}
```

### Firestore Queries

The profile page uses a filtered query to fetch only qweets from a specific user:
```javascript
db.collection('qweets')
  .where('username', '==', username)
  .orderBy('date', 'desc')
```

**Note**: This query requires a composite index in Firestore:
- Collection: `qweets`
- Fields: `username` (Ascending), `date` (Descending)

Firebase will prompt you to create this index automatically when you first visit a profile page.

### Profile Data

Currently, profile information is hardcoded for demonstration purposes. In a production application, this would be stored in a separate `users` collection in Firestore:

```javascript
// Future structure
users/{userId}
  - username: "danny__connell"
  - name: "Danny Connell"
  - avatar: "https://..."
  - bio: "Full-stack developer..."
  - joinDate: timestamp
```

### Component Structure

**PageProfile.vue**
- Main profile page component
- Handles profile data loading
- Manages user qweet feed
- Provides photo viewing dialog
- Implements like/delete functionality

**Route Configuration** (routes.js)
```javascript
{
  path: '/profile/:username',
  component: () => import('pages/PageProfile.vue'),
  name: 'Profile'
}
```

## Future Enhancements

### Planned Features

1. **User Authentication**
   - Real user accounts with Firebase Authentication
   - Secure profile editing
   - Follow/unfollow functionality

2. **Enhanced Profile Data**
   - Editable bio and profile information
   - Custom profile photos
   - Cover/banner images
   - Location and website fields
   - Join date display

3. **Additional Statistics**
   - Following count
   - Followers count
   - Total qweets with photos
   - Most liked qweet

4. **Profile Tabs**
   - Qweets tab (current default)
   - Qweets & Replies tab
   - Media tab (qweets with photos only)
   - Likes tab (qweets the user has liked)

5. **Social Features**
   - Follow/unfollow button
   - Following/followers lists
   - Mutual followers indicator
   - Block/mute functionality

6. **Privacy Controls**
   - Private/protected accounts
   - Customizable profile visibility
   - Block list management

## Usage

### Viewing a Profile

1. **From Navigation**: Click "Profile" in the left sidebar to view your own profile
2. **From Feed**: Click any username or avatar in the home feed to view that user's profile
3. **Direct URL**: Navigate to `/profile/username` to view any user's profile

### Profile Actions

- **Like a Qweet**: Click the heart icon on any qweet
- **View Photo**: Click on any photo to see it in full size
- **Delete Qweet**: Click the trash icon (only visible on your own profile)

## Development Notes

### Current Limitations

1. **Single User**: Currently hardcoded to "danny__connell" user
2. **No Authentication**: No login system implemented yet
3. **Static Profile Data**: Profile information is not stored in database
4. **No User Creation**: Cannot create new user profiles

### Testing

To test the profile feature:

1. Create some qweets from the home page
2. Click on your username or avatar to navigate to the profile
3. Verify that all your qweets appear on the profile page
4. Check that statistics (qweet count, likes) are accurate
5. Test like/unlike functionality from the profile page
6. Test delete functionality from the profile page

### Firestore Index Creation

When you first visit a profile page, Firebase may show an error about a missing index. Click the provided link to automatically create the required composite index in the Firebase Console. The index typically takes 1-2 minutes to build.

## Styling

The profile page uses consistent styling with the rest of the application:

- **Profile Header**: Light grey background (`bg-grey-2`) with padding
- **Avatar**: Large 120px circular avatar for profile header
- **Stats**: Bold numbers with grey labels
- **Qweet List**: Same styling as home feed for consistency
- **Empty State**: Centered with large icon and helpful messaging

## Accessibility

- Clickable elements have appropriate cursor styles
- Hover states provide visual feedback
- Semantic HTML structure for screen readers
- Keyboard navigation support through Quasar components
