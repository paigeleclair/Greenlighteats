# 📍 Location-Based Real Restaurant Integration

## What Changed

Your GreenLight Eats app now **automatically** uses the user's location to find and display real restaurants from the Documenu database!

## Key Features

### ✅ Automatic Location Detection
- App requests location permission on load
- No toggle needed - happens automatically
- Gracefully falls back to mock data if denied

### ✅ Real Restaurant Integration
- Searches Documenu API within 10-mile radius
- Loads up to 100 real restaurants
- Calculates actual distance from user
- Sorts by proximity (closest first)

### ✅ Smart Data Merging
- Combines real Documenu restaurants with mock data
- Removes duplicates (same restaurant name)
- All restaurants get safety scores calculated
- Seamless user experience

### ✅ User-Friendly Indicators
- **Green banner**: Shows count of real restaurants found
- **Yellow banner**: Prompts to enable location if denied
- **Console logs**: Detailed status messages for debugging

## How It Works

### 1. User Opens Search Tab
```
App requests location permission
↓
User allows location
↓
App gets lat/lon coordinates
↓
Calls Documenu API: searchRestaurantsByLocation(lat, lon, 10 miles)
↓
Calculates distance to each restaurant
↓
Sorts by distance (closest first)
↓
Merges with mock restaurants
↓
Displays in search results
```

### 2. Location Denied
```
User denies location
↓
Shows yellow warning banner
↓
Uses only mock restaurant data
↓
App still fully functional
```

## Technical Details

### Files Modified
- `/components/screens/SearchScreen.tsx` - Added automatic location fetch on mount
- `/supabase/functions/server/documenu.tsx` - Updated Restaurant object format
- `/utils/distance.ts` - Created distance calculation utility

### API Call
```typescript
// Automatic on component mount
const results = await searchRestaurantsByLocation(
  latitude,    // User's latitude
  longitude,   // User's longitude
  10,          // Search radius in miles
  { size: 100 } // Max 100 restaurants
);
```

### Distance Calculation
Uses Haversine formula to calculate accurate distance:
```typescript
const distance = calculateDistance(
  userLat, 
  userLon, 
  restaurantLat, 
  restaurantLon
);
// Returns: number in miles (e.g., 2.3)
// Formatted: "2.3 mi"
```

### Data Format
Backend returns Restaurant objects matching the app's type:
```typescript
{
  id: string;
  name: string;
  cuisine: string;
  distance: string;        // "2.3 mi"
  rating: number;          // 3.5-5.0
  safetyLevel: 'caution';  // Default
  dietaryTags: [];         // Empty by default
  image: string;           // Logo URL or empty
  geo: { lat, lng };       // For distance calc
}
```

## User Experience

### What Users See
1. Open Search tab
2. Browser asks: "Allow location access?"
3. User clicks "Allow"
4. Green banner appears: "50 real restaurants found near your location"
5. Scroll through restaurants - real ones are intermixed with mock data
6. Each restaurant shows actual distance

### Privacy
- ✅ Location never stored or saved
- ✅ Only used for one-time API call
- ✅ Cached for 5 minutes to reduce battery usage
- ✅ Not sent to any third-party except Documenu API
- ✅ Users can deny and still use app

## Performance

- **Initial load**: 2-5 seconds (location + API call)
- **Subsequent loads**: Instant (5-minute cache)
- **Search/filter**: Client-side only, instant
- **API quota**: 1 request per location access

## Limitations

### Current
- ⚠️ Nutrition data is estimated (Documenu doesn't provide)
- ⚠️ No offline support yet
- ⚠️ Results not cached long-term
- ⚠️ 10-mile radius fixed (not adjustable by user)

### Future Enhancements
- [ ] Let users set custom search radius
- [ ] Cache results in localStorage
- [ ] Manual location entry (city, zip code)
- [ ] Filter by cuisine type
- [ ] Show restaurant on map view
- [ ] Real-time updates when user moves

## Testing

### In the App
1. Open your app
2. Go to Search tab
3. Allow location
4. Look for green banner with real restaurant count
5. Scroll through restaurants

### In Console
Open browser DevTools and check for:
```
✅ Loaded 47 real restaurants from Documenu near your location
📍 Location access denied, using mock data only
⚠️ No Documenu restaurants found nearby, using mock data
```

### Manual Test
```javascript
// In browser console
const api = await import('/utils/documenuApi.ts');
const dist = await import('/utils/distance.ts');

// Test distance calculation
const miles = dist.calculateDistance(40.7128, -74.0060, 40.7589, -73.9851);
console.log(`Distance: ${miles} miles`); // Times Square to Central Park

// Test API call
const results = await api.searchRestaurantsByLocation(40.7128, -74.0060, 5);
console.log('Restaurants:', results);
```

## Troubleshooting

### No real restaurants showing
- **Check**: Did you allow location?
- **Check**: Are you in an area with restaurant coverage?
- **Try**: Urban areas (NYC, LA, Chicago) have best coverage
- **Check**: Browser console for error messages

### Location permission issues
- **Chrome**: Click lock icon in address bar → Location → Allow
- **Firefox**: Click shield icon → Permissions → Location → Allow
- **Safari**: Safari menu → Settings → Websites → Location
- **Clear**: Reset permissions and refresh page

### API errors
- **Check**: Documenu API key is valid
- **Check**: You haven't exceeded monthly quota
- **Check**: Network connection is active
- **See**: Browser console for detailed error

## Documentation

- **Full integration**: `/DOCUMENU_INTEGRATION.md`
- **Integration active**: `/INTEGRATION_ACTIVE.md`
- **Setup complete**: `/SETUP_COMPLETE.md`
- **Documenu docs**: https://documenu.com/docs

---

🎉 Your app now automatically finds real restaurants near your users!
