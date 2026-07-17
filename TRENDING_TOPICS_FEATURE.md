# Trending Topics Feature

## Overview
The Trending Topics feature adds real-time hashtag tracking and analytics to Qwitter, making it feel more like a modern social media platform. Users can see what's trending, click on topics to filter qweets, and view engagement statistics.

## Features

### 1. **Hashtag Detection & Extraction**
- Automatically detects hashtags in qweet content using regex pattern `/#[\w]+/g`
- Extracts and stores hashtags as lowercase array in Firestore
- Example: "Loving #JavaScript and #VueJS!" → `['#javascript', '#vuejs']`

### 2. **Clickable Hashtags**
- Hashtags in qweets are automatically converted to clickable links
- Styled in blue with hover effects
- Clicking a hashtag filters the feed to show only qweets with that tag
- Visual feedback with notification showing active filter

### 3. **Trending Topics Sidebar**
Located in the right sidebar, displays:
- **Top 10 trending hashtags** ranked by usage count
- **Numbered badges** (1-10) with color-coded avatars
- **Qweet count** for each hashtag
- **Trending up icon** for visual emphasis
- **Empty state** with helpful message when no hashtags exist

### 4. **Quick Stats Card**
Real-time statistics showing:
- **Total Qweets**: Count of all qweets in the system
- **Unique Hashtags**: Number of distinct hashtags used

### 5. **Real-Time Updates**
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
- `formatQweetContent(content)`: Converts hashtags to clickable HTML
- `filterByHashtag(hashtag)`: Filters qweets by selected hashtag
- `filteredQweets` computed property: Returns filtered or all qweets

#### MainLayout.vue
- `calculateHashtagCounts()`: Aggregates hashtag usage across all qweets
- `trendingTopics` computed property: Returns top 10 hashtags sorted by count
- `navigateToHashtag(hashtag)`: Navigates to home and triggers filter
- `getTrendingColor(index)`: Returns color for trending badge

### Hashtag Regex Pattern
```javascript
const hashtagRegex = /#[\w]+/g
```
- Matches: `#` followed by one or more word characters (letters, digits, underscore)
- Examples: `#JavaScript`, `#Vue3`, `#coding_tips`
- Does not match: `#`, `#123` (numbers only), `#-test` (special chars)

### Filtering Logic
```javascript
filteredQweets() {
  if (!this.filterHashtag) {
    return this.qweets
  }
  return this.qweets.filter(qweet => {
    return qweet.hashtags && qweet.hashtags.includes(this.filterHashtag.toLowerCase())
  })
}
```

## User Experience

### Posting with Hashtags
1. User types qweet with hashtags: "Excited about #VueJS!"
2. Hashtags are automatically extracted on submit
3. Qweet is saved with hashtags array
4. Trending topics update immediately
5. Hashtags appear as clickable blue links in the feed

### Filtering by Hashtag
1. User clicks a hashtag in a qweet OR clicks a trending topic
2. Feed filters to show only qweets with that hashtag
3. Notification appears with "Clear" action button
4. User can click "Clear" to remove filter
5. Filter persists until cleared or page navigation

### Trending Topics Interaction
1. Sidebar shows top 10 hashtags with counts
2. Clicking a trending topic navigates to home (if not already there)
3. Filter is applied automatically
4. Visual feedback with notification

## Styling

### Hashtag Links
```sass
.hashtag
  color: #1976d2
  cursor: pointer
  font-weight: 500
  &:hover
    text-decoration: underline
```

### Trending Cards
```sass
.trending-card
  border-radius: 16px
  overflow: hidden

.trending-item
  transition: background-color 0.2s
  &:hover
    background-color: rgba(0, 0, 0, 0.03)
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
- ✅ Computed properties for reactive filtering
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
8. **Multi-hashtag Filter**: Filter by multiple hashtags at once

## Browser Compatibility
- Uses standard JavaScript features (ES6+)
- Regex support: All modern browsers
- No polyfills required for target browsers

## Testing Checklist
- [ ] Hashtags are extracted correctly from qweet content
- [ ] Hashtags appear as clickable links in feed
- [ ] Clicking hashtag filters the feed
- [ ] Trending topics update in real-time
- [ ] Stats card shows correct counts
- [ ] Filter notification appears with clear action
- [ ] Navigation from trending topics works
- [ ] Empty state shows when no hashtags exist
- [ ] Multiple hashtags in one qweet work correctly
- [ ] Case-insensitive matching works (#VueJS = #vuejs)

## Known Limitations
1. Hashtags must be alphanumeric + underscore only
2. No support for Unicode hashtags (e.g., #日本語)
3. No hashtag validation (any word after # is accepted)
4. Deleted qweets don't immediately update trending (requires page refresh)
5. No hashtag history or archiving

## Migration Notes
- Existing qweets without `hashtags` field will work fine
- Filter will simply skip qweets without hashtags
- No database migration required
- Feature is backward compatible
