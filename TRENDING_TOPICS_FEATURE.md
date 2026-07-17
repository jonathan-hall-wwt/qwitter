# Trending Topics Feature

## Overview
The Trending Topics feature adds real-time hashtag tracking and analytics to Qwitter, making it feel more like a modern social media platform. Users can see what's trending and view engagement statistics in the sidebar.

## Features

### 1. **Hashtag Detection & Extraction**
- Automatically detects hashtags in qweet content using regex pattern `/#[\w]+/g`
- Extracts and stores hashtags as lowercase array in Firestore
- Example: "Loving #JavaScript and #VueJS!" → `['#javascript', '#vuejs']`
- Hashtags are displayed as plain text in qweets (not clickable)

### 2. **Trending Topics Sidebar**
Located in the right sidebar, displays:
- **Top 10 trending hashtags** ranked by usage count
- **Numbered badges** (1-10) with color-coded avatars
- **Qweet count** for each hashtag
- **Trending up icon** for visual emphasis
- **Empty state** with helpful message when no hashtags exist

### 3. **Quick Stats Card**
Real-time statistics showing:
- **Total Qweets**: Count of all qweets in the system
- **Unique Hashtags**: Number of distinct hashtags used

### 4. **Real-Time Updates**
- Trending topics update automatically as new qweets are posted
- Uses Firebase's `onSnapshot` listener for live data
- No page refresh needed

## Technical Implementation

### Data Structure
```javascript
// Qweet document in Firestore
{
  content: "Check out #VueJS and #Quasar!",
  date: 1234567890,
  liked: false,
  photoUrl: "...",
  hashtags: ['#vuejs', '#quasar']  // NEW FIELD
}
```

### Key Components

#### PageHome.vue
- `extractHashtags(text)`: Extracts hashtags from text
- Hashtags are stored when posting but displayed as plain text in the feed

#### MainLayout.vue
- `calculateHashtagCounts()`: Aggregates hashtag usage across all qweets
- `trendingTopics` computed property: Returns top 10 hashtags sorted by count
- `getTrendingColor(index)`: Returns color for trending badge

### Hashtag Regex Pattern
```javascript
const hashtagRegex = /#[\w]+/g
```
- Matches: `#` followed by one or more word characters (letters, digits, underscore)
- Examples: `#JavaScript`, `#Vue3`, `#coding_tips`
- Does not match: `#`, `#123` (numbers only), `#-test` (special chars)

## User Experience

### Posting with Hashtags
1. User types qweet with hashtags: "Excited about #VueJS!"
2. Hashtags are automatically extracted on submit
3. Qweet is saved with hashtags array
4. Trending topics update immediately
5. Hashtags appear as plain text in the feed

### Viewing Trending Topics
1. Sidebar shows top 10 hashtags with counts
2. Users can see what topics are popular
3. Real-time updates as new qweets are posted

## Styling

### Trending Cards
```sass
.trending-card
  border-radius: 16px
  overflow: hidden

.trending-item
  transition: background-color 0.2s
```

## Color Scheme
Trending badges rotate through Quasar colors:
1. Primary (blue)
2. Secondary (teal)
3. Accent (purple)
4. Positive (green)
5. Info (cyan)

## Performance Considerations

### Optimizations
- ✅ Hashtags stored as lowercase for case-insensitive matching
- ✅ Computed properties for reactive updates
- ✅ Single Firebase listener for all qweets
- ✅ Efficient hashtag counting algorithm

### Potential Improvements
- 🔄 Debounce hashtag count calculations for large datasets
- 🔄 Cache trending topics with time-based invalidation
- 🔄 Paginate qweets for better performance
- 🔄 Add hashtag search/autocomplete

## Future Enhancements

### Possible Features
1. **Hashtag Analytics Page**: Detailed stats for each hashtag
2. **Trending Over Time**: Show hashtag trends by day/week
3. **Related Hashtags**: Suggest similar or related tags
4. **Hashtag Following**: Subscribe to specific hashtags
5. **Hashtag Descriptions**: Allow users to add context to tags
6. **Trending Notifications**: Alert users about new trending topics
7. **Hashtag Moderation**: Report/block inappropriate hashtags
8. **Clickable Hashtags**: Add filtering functionality (currently not implemented)

## Browser Compatibility
- Uses standard JavaScript features (ES6+)
- Regex support: All modern browsers
- No polyfills required for target browsers

## Testing Checklist
- [ ] Hashtags are extracted correctly from qweet content
- [ ] Hashtags appear as plain text in feed
- [ ] Trending topics update in real-time
- [ ] Stats card shows correct counts
- [ ] Empty state shows when no hashtags exist
- [ ] Multiple hashtags in one qweet work correctly
- [ ] Case-insensitive matching works (#VueJS = #vuejs)

## Known Limitations
1. Hashtags must be alphanumeric + underscore only
2. No support for Unicode hashtags (e.g., #日本語)
3. No hashtag validation (any word after # is accepted)
4. Deleted qweets don't immediately update trending (requires page refresh)
5. No hashtag history or archiving
6. Hashtags are not clickable (no filtering functionality)

## Migration Notes
- Existing qweets without `hashtags` field will work fine
- No database migration required
- Feature is backward compatible
