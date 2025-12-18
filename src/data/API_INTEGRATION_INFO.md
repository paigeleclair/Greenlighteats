# Restaurant API Integration Options

## Overview
This document outlines potential restaurant nutrition APIs that could be integrated in the future. Currently, the app uses curated mock data with real nutritional information from major restaurant chains.

## Available Restaurant APIs

### 1. Nutritionix API
**Website:** https://www.nutritionix.com/business/api
- **Coverage:** 800+ restaurant chains, branded foods, common foods
- **Pricing:** 
  - Free tier: 500 API calls/month
  - Paid: Starting at $49/month for 10,000 calls
- **Data Includes:** Calories, macros, sodium, allergens, photos
- **Pros:** Most comprehensive restaurant database, high accuracy
- **Cons:** Requires API key, limited free tier

### 2. USDA FoodData Central API
**Website:** https://fdc.nal.usda.gov/api-guide.html
- **Coverage:** 300,000+ foods (branded and generic)
- **Pricing:** Free (government-provided)
- **Data Includes:** Detailed nutrition facts
- **Pros:** Completely free, no API key limits
- **Cons:** Limited restaurant-specific data, less user-friendly

### 3. Edamam Nutrition API
**Website:** https://www.edamam.com/nutrition-api
- **Coverage:** 900,000+ foods, restaurant chains
- **Pricing:** 
  - Free tier: Limited calls
  - Paid: Custom pricing
- **Data Includes:** Full nutrition breakdown, allergens
- **Pros:** Good accuracy, recipe analysis
- **Cons:** Expensive for high volume

### 4. Spoonacular Food API
**Website:** https://spoonacular.com/food-api
- **Coverage:** Menu items, recipes, ingredients
- **Pricing:** 
  - Free tier: 150 points/day
  - Paid: Starting at $49/month
- **Data Includes:** Nutrition, ingredients, allergens
- **Pros:** Good search capabilities
- **Cons:** Limited free tier

## Current Implementation

### Mock Data Benefits
1. **No API Costs:** Free during development and for freemium users
2. **Fast Performance:** No API latency
3. **Reliability:** No rate limits or downtime
4. **Control:** Curated data ensures accuracy
5. **Privacy:** No data sharing with third parties

### Data Sources
The current mock data is based on:
- Official restaurant nutrition PDFs
- Publicly available menu nutritional information
- Restaurant chain websites

## Future Integration Strategy

### Phase 1: MVP (Current)
- Use curated mock data for 8-10 major chains
- Focus on user experience and app functionality

### Phase 2: Premium Feature
- Integrate Nutritionix API for premium users
- Offer 50+ restaurant chains
- Real-time menu updates

### Phase 3: Expansion
- Add USDA API for generic/home-cooked food tracking
- Implement caching to reduce API calls
- Build proprietary database from user contributions

## Integration Example (Nutritionix)

```typescript
// Future implementation example
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;
const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;

async function searchRestaurantItems(query: string) {
  const response = await fetch('https://trackapi.nutritionix.com/v2/search/instant', {
    method: 'GET',
    headers: {
      'x-app-id': NUTRITIONIX_APP_ID,
      'x-app-key': NUTRITIONIX_API_KEY,
    },
    params: {
      query,
      branded: true,
    }
  });
  
  const data = await response.json();
  return data.branded; // Returns restaurant items
}
```

## Recommendation

For a freemium restaurant safety app:
1. **Keep mock data** for core functionality
2. **Add Nutritionix API** as premium feature ($4.99/month tier)
3. **Cache API results** to minimize costs
4. **Hybrid approach:** Mock data for major chains, API for expanded coverage

This allows you to:
- Offer a great free experience
- Justify premium pricing with expanded restaurant coverage
- Control costs during growth phase
- Maintain fast performance
