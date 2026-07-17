# Trending Qashtags Feature Documentation

## Overview

The Trending Qashtags feature adds hashtag functionality to Qwitter, allowing users to tag their qweets with topics and discover trending conversations. This feature includes automatic hashtag detection, clickable hashtag links, dedicated hashtag pages, and a real-time trending sidebar.

## Features

### 1. Automatic Qashtag Detection

When users create a qweet, any hashtags (words starting with `#`) are automatically detected and extracted:

- **Pattern**: `#[\w]+` (hashtag followed by alphanumeric characters and underscores)
- **Storage**: Qashtags are stored as an array in lowercase format in Firestore
- **Example**: "Loving #JavaScript and #VueJS!" → `['#javascript', '#vuejs']`

### 2. Clickable Qashtags in Qweets

All qashtags displayed in qweets are automatically converted to clickable links:

- Clicking a qashtag navigates to `/qashtag/:qashtag`
- Qashtags are styled in blue with hover effects
- Works in both the home feed and qashtag pages

### 3. Qashtag Page (`/qashtag/:qashtag`)

A dedicated page that displays all qweets containing a specific qashtag:

**Features**:
- Beautiful gradient header showing the qashtag and qweet count
- Real-time updates as new qweets are posted
- Full qweet functionality (like, delete, photo viewing)
- Loading and empty states
- Chronological ordering (newest first)

**Route**: `/qashtag/:qashtag` (e.g., `/qashtag/javascript`)

### 4. Trending Qashtags Sidebar

The right sidebar now displays real-time trending qashtags:

**Features**:
- Top 10 most-used qashtags
- Real-time updates as qweets are posted/deleted
- Shows qweet count for each qashtag
- Ranked display with color-coded trending indicators:
  - 🔴 #1: Red
  - 🟠 #2: Orange
  - 🟡 #3: Amber
  - 🔵 #4-10: Blue
- Clickable items that navigate to qashtag pages
- Loading and empty states

## Technical Implementation

### Data Structure

**Qweet Document** (Firestore):
```javascript
{
  content: "Check out this #JavaScript tutorial! #coding",
  date: 1234567890,
  liked: false,
  photoUrl: "https://...",  // optional
  qashtags: ['#javascript', '#coding']  // new field
}
```

### Key Methods

**PageHome.vue**:
- `extractQashtags(content)`: Extracts hashtags from qweet content
- `formatQweetContent(content)`: Converts hashtags to clickable HTML links

**PageQashtag.vue**:
- `loadQweets()`: Queries Firestore for qweets containing the specific qashtag
- Uses `array-contains` query on the `qashtags` field

**MainLayout.vue**:
- `calculateTrending()`: Aggregates qashtag usage across all qweets
- Real-time listener updates trending list automatically

### Firestore Queries

**Qashtag Page Query**:
```javascript
db.collection('qweets')
  .where('qashtags', 'array-contains', '#javascript')
  .orderBy('date', 'desc')
```

**Note**: This query requires a composite index in Firestore:
- Collection: `qweets`
- Fields: `qashtags` (Arrays) + `date` (Descending)

Firebase will automatically prompt you to create this index when you first use the feature.

### Real-Time Updates

All components use Firestore's `onSnapshot()` listeners for real-time updates:
- Home feed updates when new qweets are posted
- Qashtag pages update when matching qweets are added/removed
- Trending sidebar recalculates when any qweet changes

## User Experience

### Creating a Qweet with Qashtags

1. User types a qweet with hashtags: "Excited about #Quasar and #Firebase!"
2. Hashtags are automatically detected and extracted
3. Qweet is saved with the `qashtags` array
4. Hashtags appear as blue clickable links in the feed
5. Trending sidebar updates to reflect the new hashtags

### Browsing by Qashtag

1. User clicks a qashtag link (e.g., #JavaScript)
2. Navigates to `/qashtag/javascript`
3. Sees all qweets tagged with #javascript
4. Can interact with qweets (like, delete, view photos)
5. Can click other qashtags to explore related topics

### Discovering Trending Topics

1. User views the trending sidebar on the right
2. Sees top 10 qashtags ranked by usage
3. Clicks a trending qashtag to explore
4. Trending list updates in real-time as qweets are posted

## Styling

### Qashtag Links
- Color: `#1976d2` (primary blue)
- Font weight: 500 (medium)
- Hover: Underline decoration

### Trending Sidebar
- Background: `#f7f9fc` (light blue-grey)
- Border radius: 16px
- Hover effect on items

### Qashtag Page Header
- Gradient background: Purple to blue (`#667eea` → `#764ba2`)
- White text
- Large heading with qweet count

## Future Enhancements

Potential improvements for future iterations:

1. **Trending Algorithm**: Weight recent qweets more heavily
2. **Time-based Trending**: Show trending in last 24 hours, week, etc.
3. **Qashtag Suggestions**: Auto-suggest popular qashtags while typing
4. **Multiple Qashtag Filtering**: View qweets with multiple qashtags
5. **Qashtag Following**: Follow specific qashtags for personalized feeds
6. **Qashtag Analytics**: Show qashtag usage over time
7. **Related Qashtags**: Suggest related qashtags on qashtag pages

## Testing Checklist

When testing the Trending Qashtags feature:

- [ ] Create a qweet with hashtags (e.g., "Hello #world #test")
- [ ] Verify qashtags are stored in Firestore as lowercase array
- [ ] Verify qashtags appear as blue clickable links in feed
- [ ] Click a qashtag link and verify navigation to qashtag page
- [ ] Verify qashtag page shows correct qweets
- [ ] Verify qashtag page header shows correct count
- [ ] Create multiple qweets with same qashtag
- [ ] Verify trending sidebar shows the qashtag
- [ ] Verify trending sidebar updates in real-time
- [ ] Verify trending sidebar shows correct qweet counts
- [ ] Click trending qashtag and verify navigation
- [ ] Delete a qweet with qashtags
- [ ] Verify trending counts update correctly
- [ ] Test empty state on qashtag page with no qweets
- [ ] Test qashtags with numbers and underscores (#test_123)
- [ ] Verify Firestore index is created (Firebase will prompt)

## Browser Compatibility

The feature uses standard JavaScript and Vue.js features compatible with all modern browsers as defined in the project's browserslist configuration.

## Performance Considerations

- **Real-time Listeners**: Each page subscribes to Firestore listeners that are properly cleaned up on component destruction
- **Trending Calculation**: Performed client-side by aggregating all qweets (suitable for small to medium datasets)
- **Query Optimization**: Uses indexed queries for efficient qashtag filtering

For larger scale deployments, consider:
- Server-side trending calculation with Cloud Functions
- Caching trending results
- Pagination for qashtag pages with many qweets
