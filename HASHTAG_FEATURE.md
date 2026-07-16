# Hashtag Feature

This document describes the hashtag feature added to Qwitter.

## Overview

The hashtag feature allows users to:
- Use hashtags in their qweets (e.g., #javascript, #coding, #vue)
- Click on hashtags to see all qweets containing that hashtag
- View trending hashtags in the right sidebar

## Implementation Details

### Components

#### 1. PageHashtag.vue
A new page component that displays all qweets containing a specific hashtag.
- Route: `/hashtag/:hashtag`
- Queries Firebase for qweets with matching hashtags
- Displays qweets in the same format as the home page
- Hashtags in qweet content are clickable links

#### 2. TrendingHashtags.vue
A sidebar component that shows the top 5 trending hashtags.
- Analyzes the most recent 100 qweets
- Counts hashtag occurrences
- Displays hashtags sorted by frequency
- Each hashtag is clickable and navigates to the hashtag page

### Data Structure

Qweets now include a `hashtags` field:
```javascript
{
  content: "Check out this #vue #javascript tutorial!",
  date: 1234567890,
  liked: false,
  hashtags: ["vue", "javascript"] // Array of lowercase hashtag strings
}
```

### Key Functions

#### extractHashtags(content)
Extracts all hashtags from qweet content:
- Uses regex pattern `/#(\w+)/g` to find hashtags
- Converts to lowercase for consistent querying
- Removes duplicates
- Returns array of hashtag strings

#### formatContent(content)
Formats qweet content for display:
- Converts hashtags to clickable links
- Preserves original text formatting
- Returns HTML string for v-html rendering

### Firebase Queries

#### Finding qweets by hashtag:
```javascript
db.collection('qweets')
  .where('hashtags', 'array-contains', hashtag.toLowerCase())
  .orderBy('date', 'desc')
```

**Note:** This query requires a Firebase index. When you first use this feature, Firebase will provide a link to create the required index.

#### Loading trending hashtags:
```javascript
db.collection('qweets')
  .orderBy('date', 'desc')
  .limit(100)
```

## Usage

### Creating qweets with hashtags
Simply type hashtags in your qweet content:
```
Learning #VueJS with #Quasar is amazing! #webdev
```

### Viewing qweets by hashtag
1. Click any hashtag in a qweet
2. Or click a trending hashtag in the sidebar
3. The hashtag page will show all matching qweets

### Trending hashtags
- Automatically updated in real-time
- Shows top 5 most used hashtags from recent qweets
- Displays qweet count for each hashtag

## Future Enhancements

Potential improvements:
- Search functionality for hashtags
- Hashtag autocomplete when typing
- User-specific hashtag following
- Hashtag analytics and history
- Related hashtags suggestions
- Hashtag categories or grouping
