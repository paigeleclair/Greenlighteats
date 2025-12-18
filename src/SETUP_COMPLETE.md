# ✅ Documenu API Integration - Setup Complete!

## What Was Done

Your GreenLight Eats app is now fully integrated with the Documenu API to fetch real restaurant data from over 600,000 US restaurants!

### 1. Backend Setup ✅
- **Created** `/supabase/functions/server/documenu.tsx` - Documenu service with API integration
- **Updated** `/supabase/functions/server/index.tsx` - Added 4 new server routes:
  - `GET /restaurants/search` - Search by location (lat/lon)
  - `GET /restaurants/state/:state` - Search by state code
  - `GET /restaurants/zip/:zipCode` - Search by zip code
  - `GET /restaurant/:id` - Get restaurant with full menu
- **Secured** API key in environment variable `DOCUMENU_API_KEY` (server-side only)

### 2. Frontend Utils ✅
- **Created** `/utils/documenuApi.ts` - Frontend wrapper functions:
  - `searchRestaurantsByLocation(lat, lon, distance)`
  - `getRestaurantsByState(state)`
  - `getRestaurantsByZipCode(zipCode)`
  - `getRestaurantDetail(restaurantId)`

### 3. UI Integration ✅
- **Updated** `/components/screens/SearchScreen.tsx`:
  - Added "Real Data" toggle switch in header
  - Automatically tries to use user's location first
  - Falls back to zip code search if location denied
  - Shows toast notifications for success/errors
  - Green indicator badge when using live data

### 4. Data Transformation ✅
The backend automatically converts Documenu's format to your app's format:
- Restaurant objects with all required fields
- Menu items with categories and pricing
- **Mock nutritional data** generated (Documenu doesn't provide this)
- Dietary tags extracted from names/descriptions

## How to Use

### In the App
1. Go to the **Search** tab
2. Toggle the **"Real Data"** switch at the top right
3. Allow location access when prompted (or it uses zip code 10001)
4. Browse real restaurants from the Documenu database!

### In Code
```typescript
import { searchRestaurantsByLocation } from './utils/documenuApi';

// Search near a location
const results = await searchRestaurantsByLocation(
  40.7128,  // NYC latitude
  -74.0060, // NYC longitude  
  5         // 5 miles radius
);

console.log(results.restaurants); // Array of restaurants
console.log(results.total);       // Total count
```

## Important Notes

### ⚠️ Nutritional Data is Mock
Documenu does **NOT** provide nutritional information. The backend generates estimated values based on dish names:
- Salads: ~350 calories, 500mg sodium
- Burgers: ~650 calories, 1100mg sodium
- Pasta: ~700 calories, 950mg sodium
- Chicken/Fish: ~450 calories, 700mg sodium

For accurate nutrition, you would need to:
1. Use another API (Nutritionix, USDA FoodData)
2. Manually curate data
3. Partner with restaurants for official data

### 🔒 API Key Security
- ✅ Your API key is stored server-side in Supabase
- ✅ Never exposed to the browser
- ✅ Can't be stolen from client code
- ✅ Requests go through your backend proxy

### 💰 API Usage
Make sure to check your Documenu plan limits:
- Request quota per month
- Rate limiting
- Cost per request

Consider caching results to minimize API calls.

### 🎯 Safety Calculations
Real restaurant data will show "caution" by default. The app needs to:
1. Calculate actual safety based on user preferences
2. Apply dietary restriction filters
3. Update safety scores dynamically

## Testing the Integration

### Test in Browser Console:
```javascript
// Import the API utility
const api = await import('/utils/documenuApi.ts');

// Search NYC restaurants
const results = await api.searchRestaurantsByLocation(40.7128, -74.0060, 5);
console.log('Found restaurants:', results);

// Search by zip code
const zipResults = await api.getRestaurantsByZipCode('10001');
console.log('Zip results:', results);
```

### Check Backend Health:
```
https://altsqlpkfqrbmxvhmzce.supabase.co/functions/v1/make-server-d61ee9e1/health
```

## Next Steps

### Immediate Enhancements:
1. **Add location search input** - Let users enter a city/address
2. **Show distance** - Calculate distance from user to restaurant
3. **Cache results** - Store API responses to reduce calls
4. **Error handling** - Better UX for API failures
5. **Loading states** - Show skeleton screens while fetching

### Advanced Features:
1. **Nutrition API integration** - Get real nutritional data
2. **Restaurant reviews** - Add Yelp/Google reviews
3. **Menu photos** - Show actual dish photos
4. **Ordering integration** - Link to delivery services
5. **Favorites sync** - Save Documenu restaurants

### Performance:
1. **Debounce searches** - Don't API call on every keystroke
2. **Pagination** - Load more restaurants as user scrolls
3. **Lazy loading** - Only load visible restaurant cards
4. **Service worker** - Cache API responses offline

## Troubleshooting

### "Failed to load restaurants"
- Check if DOCUMENU_API_KEY is set correctly
- Verify API key is valid at documenu.com
- Check browser console for detailed errors
- Ensure you have API quota remaining

### "No restaurants found"
- Try a different location/zip code
- Check if the area has restaurant coverage
- Try increasing the search radius (distance parameter)

### Backend errors
- Check Supabase logs for server errors
- Verify backend routes are deployed
- Test the health endpoint

## Documentation

- **Full Integration Guide**: `/DOCUMENU_INTEGRATION.md`
- **Documenu API Docs**: https://documenu.com/docs
- **Documenu Discord**: https://discord.gg/QazHj6N5rd

## Summary

🎉 **You now have a fully working real-time restaurant data integration!**

Your app can:
- ✅ Search 600,000+ real US restaurants
- ✅ Get full menus with pricing
- ✅ Filter by location, state, or zip code
- ✅ Toggle between mock and real data
- ✅ Securely call the API without exposing keys

Just toggle the "Real Data" switch in the Search screen to see it in action!
