# Documenu API Integration Guide

## ✅ Setup Complete!

Your GreenLight Eats app is now connected to the Documenu API with secure backend integration.

## 🔑 API Key Setup

You've already configured your `DOCUMENU_API_KEY` environment variable. The API key is securely stored server-side and will never be exposed to the frontend.

## 📡 Available Endpoints

### 1. Search Restaurants by Location
Search for restaurants near a specific latitude/longitude:

```typescript
import { searchRestaurantsByLocation } from './utils/documenuApi';

const results = await searchRestaurantsByLocation(
  40.7128,  // latitude (NYC)
  -74.0060, // longitude
  5,        // distance in miles
  {
    cuisine: 'Italian',  // optional
    size: 25,            // optional (results per page)
    page: 1              // optional (pagination)
  }
);

console.log(results.restaurants); // Array of Restaurant objects
console.log(results.total);       // Total count
```

### 2. Search Restaurants by State
Get restaurants in a specific state:

```typescript
import { getRestaurantsByState } from './utils/documenuApi';

const results = await getRestaurantsByState('NY', {
  cuisine: 'Mexican',
  size: 50,
  page: 1,
  fullmenu: true  // Include full menu items
});
```

### 3. Search Restaurants by Zip Code
Find restaurants in a specific zip code:

```typescript
import { getRestaurantsByZipCode } from './utils/documenuApi';

const results = await getRestaurantsByZipCode('10001', {
  cuisine: 'American',
  size: 25,
  fullmenu: true
});
```

### 4. Get Restaurant Details with Menu
Fetch a single restaurant with its complete menu:

```typescript
import { getRestaurantDetail } from './utils/documenuApi';

const { restaurant, menuItems } = await getRestaurantDetail('4072702673999819');

console.log(restaurant);  // Restaurant object
console.log(menuItems);   // Array of MenuItem objects
```

## 🔄 Data Transformation

The backend automatically transforms Documenu's data format into GreenLight Eats format:

### Restaurant Object
```typescript
{
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceLevel: number;  // 1-4 ($-$$$$)
  distance: number;
  address: string;
  imageUrl?: string;
  hours?: string;
  phone?: string;
  website?: string;
  geo?: { lat: number; lng: number };
}
```

### MenuItem Object
```typescript
{
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sodium: number;
  };
  tags: string[];  // e.g., ['Vegan', 'GF']
  safetyLevel: 'safe' | 'caution' | 'unsafe';
}
```

## ⚠️ Important Notes

### Nutrition Data
**Documenu does NOT provide nutritional information.** The backend generates mock nutritional data based on dish names and keywords:

- Salads: ~350 cal, lower sodium
- Burgers: ~650 cal, higher sodium
- Pasta: ~700 cal, moderate sodium
- Chicken/Fish: ~450 cal, moderate sodium
- Soups: ~300 cal, higher sodium

For a production app, you would need to:
1. Use another API (like Nutritionix) for real nutritional data
2. Manually curate nutritional information
3. Allow users to input their own data

### Safety Calculations
The `safetyLevel` is set to `'caution'` by default. You should:
1. Calculate actual safety based on user preferences
2. Use the `calculateSafetyLevel` function with user's dietary restrictions
3. Update safety scores when user preferences change

## 🎯 Next Steps to Integrate into UI

### Option 1: Add Toggle to Search Screen
Add a switch to let users choose between mock data and real Documenu data:

```typescript
const [useRealData, setUseRealData] = useState(false);

// When searching:
if (useRealData) {
  // Use Documenu API
  const results = await searchRestaurantsByLocation(lat, lon, 5);
  setRestaurants(results.restaurants);
} else {
  // Use mock data
  setRestaurants(realRestaurants);
}
```

### Option 2: Location-Based Search
Use the user's location to find nearby restaurants:

```typescript
// Get user location
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;
  
  // Search Documenu
  const results = await searchRestaurantsByLocation(
    latitude, 
    longitude, 
    5  // 5 mile radius
  );
  
  setRestaurants(results.restaurants);
});
```

### Option 3: Replace Mock Data Entirely
Update your app to use Documenu as the primary data source instead of mock data.

## 🧪 Testing

Test the API integration:

1. Open browser dev tools
2. Run in console:
```javascript
const { searchRestaurantsByLocation } = await import('/utils/documenuApi.ts');
const results = await searchRestaurantsByLocation(40.7128, -74.0060, 5);
console.log(results);
```

## 📊 API Limits

Check your Documenu account for:
- Requests per month
- Rate limits
- Cost per request

Make sure to cache results when possible to avoid unnecessary API calls.

## 🔒 Security

✅ **API Key is secure**: Stored in environment variables, never exposed to frontend
✅ **CORS enabled**: Only your domain can access the backend
✅ **Backend validation**: All requests are validated server-side

## 💡 Tips

1. **Cache aggressively**: Restaurant data doesn't change often
2. **Pagination**: Use page parameter for large result sets
3. **Error handling**: Always wrap API calls in try/catch
4. **Loading states**: Show skeleton screens while fetching
5. **Fallback**: Keep mock data as fallback if API fails

## 🆘 Support

- Documenu Docs: https://documenu.com/docs
- Documenu Discord: https://discord.gg/QazHj6N5rd
- Email: support@documenu.com
