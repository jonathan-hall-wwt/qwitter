# Bookmarks Feature

## Overview

The Bookmarks feature allows users to save qweets they want to read later. This is a core social media functionality that enhances user engagement and content discovery.

## Features

### 1. Bookmark/Unbookmark Qweets
- **Bookmark Icon**: Each qweet in the feed has a bookmark icon
- **Visual Feedback**: Bookmarked qweets show a filled bookmark icon in primary color
- **Toggle Functionality**: Click to bookmark, click again to remove
- **Instant Notifications**: Toast notifications confirm bookmark actions

### 2. Dedicated Bookmarks Page
- **Route**: `/bookmarks`
- **Navigation**: Accessible from the left sidebar menu
- **Header**: Shows total count of bookmarked qweets
- **Empty State**: Helpful message when no bookmarks exist
- **Real-time Updates**: Automatically syncs when bookmarks are added/removed

### 3. Full Qweet Functionality
- **Like/Unlike**: Works on bookmarked qweets
- **Photo Viewing**: Click photos to view full-size
- **Remove Bookmark**: Quick removal from the bookmarks page
- **Timestamps**: Shows relative time (e.g., "2 hours ago")

## Technical Implementation

### Firestore Data Structure

**Bookmarks Collection** (`bookmarks`):
```javascript
{
  userId: "danny__connell",    // String - user who bookmarked
  qweetId: "abc123",           // String - reference to qweet
  bookmarkedAt: 1234567890     // Number - Unix timestamp
}
```

### Required Firestore Indexes

Firebase will automatically prompt you to create these composite indexes:

1. **Bookmarks by User and Time**:
   - Collection: `bookmarks`
   - Fields: `userId` (Ascending) + `bookmarkedAt` (Descending)
   - Used for: Fetching user's bookmarks in chronological order

2. **Bookmarks by User and Qweet**:
   - Collection: `bookmarks`
   - Fields: `userId` (Ascending) + `qweetId` (Ascending)
   - Used for: Checking if a qweet is bookmarked and removing bookmarks

### Component Architecture

**PageHome.vue** - Main feed with bookmark functionality:
- `bookmarkedQweetIds[]`: Array tracking which qweets are bookmarked
- `isBookmarked(qweetId)`: Helper method to check bookmark status
- `toggleBookmark(qweet)`: Add or remove bookmark
- Real-time listener for user's bookmarks

**PageBookmarks.vue** - Dedicated bookmarks page:
- `bookmarkedQweets[]`: Array of full qweet objects
- `removeBookmark(qweetId)`: Remove a bookmark
- Real-time listeners for both bookmarks and qweet updates
- Fetches full qweet data for each bookmark

## User Interface

### Home Feed
- Bookmark icon appears in the action row below each qweet
- Empty bookmark icon (bookmark_border) for unbookmarked qweets
- Filled bookmark icon (bookmark) in primary color for bookmarked qweets
- Tooltip shows "Bookmark" or "Remove bookmark"

### Bookmarks Page
- Header with bookmark icon and title
- Count of saved qweets
- Empty state with large icon and helpful message
- Qweet list with same layout as home feed
- Bookmark icon is always filled (primary color)
- Clicking bookmark removes it from the list

### Navigation
- "Bookmarks" menu item in left sidebar
- Bookmark icon next to label
- Active state when on bookmarks page

## Notifications

- **Bookmark Added**: "Qweet bookmarked!" (positive, bookmark icon)
- **Bookmark Removed**: "Bookmark removed" (positive, bookmark_remove icon)
- **Error**: "Error updating bookmark" (negative, error icon)
- All notifications appear at the top of the screen

## Testing Checklist

- [ ] Bookmark a qweet from the home feed
- [ ] Verify bookmark icon changes to filled state
- [ ] Navigate to bookmarks page
- [ ] Verify bookmarked qweet appears
- [ ] Remove bookmark from bookmarks page
- [ ] Verify qweet disappears from bookmarks
- [ ] Return to home feed
- [ ] Verify bookmark icon is empty again
- [ ] Bookmark multiple qweets
- [ ] Verify count updates on bookmarks page
- [ ] Test with photos attached to qweets
- [ ] Test like/unlike from bookmarks page
- [ ] Verify empty state when no bookmarks
- [ ] Test real-time sync across multiple tabs
- [ ] Check responsive design on mobile

## Related Files

- `src/pages/PageHome.vue` - Main feed with bookmark toggle
- `src/pages/PageBookmarks.vue` - Dedicated bookmarks page
- `src/layouts/MainLayout.vue` - Navigation with bookmarks link
- `src/router/routes.js` - Route configuration
- `src/boot/firebase.js` - Firebase initialization

## Firestore Collections

- `qweets` - Main qweet data
- `bookmarks` - Bookmark relationships (new)
