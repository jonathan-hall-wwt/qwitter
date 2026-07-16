# User Profile Feature

## Overview
The User Profile feature allows users to view their personal profile page with statistics and all their qweets in one place.

## Features

### Profile Header
- **Profile Picture**: Displays the user's avatar (currently using Gravatar)
- **User Information**: Shows username and handle
- **Join Date**: Displays when the user joined Qwitter
- **Bio**: A customizable bio section where users can describe themselves (max 160 characters)
- **Edit Profile Button**: Allows users to update their bio

### Profile Statistics
The profile page displays three key statistics:
1. **Total Qweets**: The number of qweets posted by the user
2. **Likes Received**: The number of qweets that have been liked
3. **Photos**: The number of qweets that include photos

### User's Qweets
- Displays all qweets posted by the user in reverse chronological order (newest first)
- Each qweet shows:
  - Content text
  - Timestamp (relative time format)
  - Photo (if attached)
  - Action buttons (comment, retweet, like, delete)
- Real-time updates using Firebase listeners
- Empty state with call-to-action when no qweets exist

### Edit Profile Dialog
- Modal dialog for editing profile information
- Currently supports editing the bio
- Character counter (160 character limit)
- Save/Cancel actions
- Success notification on save

## Technical Implementation

### Component Structure
- **Location**: `src/pages/PageProfile.vue`
- **Route**: `/profile`
- **Navigation**: Accessible from the main sidebar menu

### Data Management
- Uses Firebase Firestore for real-time data synchronization
- Listens to the `qweets` collection for updates
- Filters and displays all qweets (in a real multi-user app, this would filter by user ID)

### Styling
- Responsive design that works on mobile, tablet, and desktop
- Primary color header with white text
- Statistics displayed in a grid layout
- Consistent styling with the rest of the application

## Future Enhancements

Potential improvements for the profile feature:

1. **User Authentication**: Integrate with Firebase Auth to support multiple users
2. **Profile Picture Upload**: Allow users to upload custom profile pictures
3. **Cover Photo**: Add a banner/cover photo option
4. **Following/Followers**: Display follower and following counts
5. **Tabs**: Separate tabs for "Qweets", "Qweets & Replies", "Media", "Likes"
6. **Edit More Fields**: Allow editing of display name, location, website, etc.
7. **Public Profiles**: Make profiles viewable by other users at `/profile/:username`
8. **Profile Verification**: Add verified badge support
9. **Activity Timeline**: Show user activity beyond just qweets
10. **Export Data**: Allow users to download their qweet history

## Usage

### Accessing the Profile
1. Click on the "Profile" link in the left sidebar
2. Or navigate directly to `/profile`

### Editing Your Profile
1. Go to your profile page
2. Click the "Edit Profile" button
3. Update your bio in the dialog
4. Click "Save" to apply changes

### Managing Your Qweets
From your profile page, you can:
- View all your qweets
- Like/unlike your own qweets
- Delete qweets you no longer want
- Click on photos to view them full-size

## Code Example

### Basic Profile Component Structure
```vue
<template>
  <q-page>
    <!-- Profile Header -->
    <div class="profile-header">
      <q-avatar>...</q-avatar>
      <div>User Info</div>
      <q-btn @click="editProfile">Edit Profile</q-btn>
    </div>

    <!-- Statistics -->
    <div class="stats">
      <div>Qweets: {{ userQweets.length }}</div>
      <div>Likes: {{ totalLikes }}</div>
      <div>Photos: {{ qweetsWithPhotos }}</div>
    </div>

    <!-- User's Qweets -->
    <q-list>
      <q-item v-for="qweet in userQweets" :key="qweet.id">
        <!-- Qweet content -->
      </q-item>
    </q-list>
  </q-page>
</template>
```

## Dependencies
- Vue.js 2.x
- Quasar Framework
- Firebase (Firestore & Storage)
- date-fns (for date formatting)
