// Documenu API integration service

const DOCUMENU_API_BASE = 'https://api.documenu.com/v2';

interface DocumenuRestaurant {
  restaurant_id: string;
  restaurant_name: string;
  restaurant_phone: string;
  restaurant_website?: string;
  hours?: string;
  price_range?: string;
  price_range_num?: number;
  restaurant_logo?: string;
  cuisines?: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    formatted?: string;
  };
  geo?: {
    lat?: number;
    lon?: number;
  };
  menus?: DocumenuMenu[];
}

interface DocumenuMenu {
  menu_name: string;
  menu_sections?: DocumenuSection[];
}

interface DocumenuSection {
  section_name: string;
  description?: string;
  menu_items?: DocumenuMenuItem[];
}

interface DocumenuMenuItem {
  name: string;
  description?: string;
  pricing?: Array<{ price?: number; currency?: string; priceString?: string }>;
  price?: number;
  subsection?: string;
}

export class DocumenuService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchFromDocumenu(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${DOCUMENU_API_BASE}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key].toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        'X-API-KEY': this.apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Documenu API error: ${response.status} - ${errorText}`);
      throw new Error(`Documenu API error: ${response.status}`);
    }

    return await response.json();
  }

  // Search restaurants by geo location
  async searchRestaurantsByGeo(params: {
    lat: number;
    lon: number;
    distance: number;
    cuisine?: string;
    size?: number;
    page?: number;
    fullmenu?: boolean;
  }) {
    return await this.fetchFromDocumenu('/restaurants/search/geo', params);
  }

  // Get restaurants by state
  async getRestaurantsByState(state: string, params: {
    cuisine?: string;
    size?: number;
    page?: number;
    fullmenu?: boolean;
  } = {}) {
    return await this.fetchFromDocumenu(`/restaurants/state/${state}`, params);
  }

  // Get restaurants by zip code
  async getRestaurantsByZipCode(zipCode: string, params: {
    cuisine?: string;
    size?: number;
    page?: number;
    fullmenu?: boolean;
  } = {}) {
    return await this.fetchFromDocumenu(`/restaurants/zip_code/${zipCode}`, params);
  }

  // Get single restaurant by ID
  async getRestaurant(restaurantId: string) {
    return await this.fetchFromDocumenu(`/restaurant/${restaurantId}`);
  }

  // Get restaurant menu items
  async getRestaurantMenuItems(restaurantId: string, params: {
    size?: number;
    page?: number;
  } = {}) {
    return await this.fetchFromDocumenu(`/menuitems/${restaurantId}`, params);
  }

  // Transform Documenu restaurant to GreenLight format
  transformRestaurant(docRestaurant: DocumenuRestaurant) {
    // Extract cuisine (use first one if multiple)
    const cuisine = docRestaurant.cuisines?.[0] || 'American';
    
    // Calculate a mock rating (in real app, you might have actual reviews)
    const rating = 3.5 + Math.random() * 1.5; // Random between 3.5-5.0
    
    return {
      id: docRestaurant.restaurant_id,
      name: docRestaurant.restaurant_name,
      cuisine: cuisine,
      rating: parseFloat(rating.toFixed(1)),
      distance: '0 mi', // Will be calculated on frontend
      safetyLevel: 'caution', // Default, will be calculated based on user preferences
      dietaryTags: [], // Will be calculated from menu items
      image: docRestaurant.restaurant_logo || '',
      // Extra fields for detail view
      priceLevel: docRestaurant.price_range_num || 2,
      address: docRestaurant.address?.formatted || 
               `${docRestaurant.address?.street || ''}, ${docRestaurant.address?.city || ''}, ${docRestaurant.address?.state || ''}`.trim(),
      hours: docRestaurant.hours,
      phone: docRestaurant.restaurant_phone,
      website: docRestaurant.restaurant_website,
      geo: docRestaurant.geo ? {
        lat: docRestaurant.geo.lat || 0,
        lng: docRestaurant.geo.lon || 0,
      } : undefined,
    };
  }

  // Transform Documenu menu items to GreenLight format
  transformMenuItems(docRestaurant: DocumenuRestaurant) {
    const menuItems: any[] = [];

    if (!docRestaurant.menus) {
      return menuItems;
    }

    docRestaurant.menus.forEach(menu => {
      menu.menu_sections?.forEach(section => {
        section.menu_items?.forEach(item => {
          // Get price
          let price = item.price;
          if (!price && item.pricing && item.pricing.length > 0) {
            price = item.pricing[0].price;
          }

          // Generate mock nutritional data (Documenu doesn't provide this)
          // In a real app, you'd need another API or data source for nutrition
          const mockNutrition = this.generateMockNutrition(item.name);

          menuItems.push({
            id: `${docRestaurant.restaurant_id}-${item.name.replace(/\s+/g, '-').toLowerCase()}`,
            restaurantId: docRestaurant.restaurant_id,
            name: item.name,
            description: item.description || '',
            category: section.section_name,
            price: price || 0,
            nutrition: mockNutrition,
            tags: this.extractDietaryTags(item.name, item.description || ''),
            safetyLevel: 'caution', // Will be calculated based on user preferences
          });
        });
      });
    });

    return menuItems;
  }

  // Generate mock nutrition data (since Documenu doesn't provide it)
  private generateMockNutrition(itemName: string) {
    const name = itemName.toLowerCase();
    
    // Base values
    let calories = 500;
    let protein = 20;
    let carbs = 40;
    let fat = 20;
    let sodium = 800;

    // Adjust based on keywords
    if (name.includes('salad')) {
      calories = 350;
      protein = 15;
      carbs = 30;
      fat = 15;
      sodium = 500;
    } else if (name.includes('burger') || name.includes('sandwich')) {
      calories = 650;
      protein = 30;
      carbs = 50;
      fat = 28;
      sodium = 1100;
    } else if (name.includes('pasta')) {
      calories = 700;
      protein = 25;
      carbs = 80;
      fat = 22;
      sodium = 950;
    } else if (name.includes('chicken') || name.includes('fish')) {
      calories = 450;
      protein = 35;
      carbs = 25;
      fat = 18;
      sodium = 700;
    } else if (name.includes('steak') || name.includes('beef')) {
      calories = 600;
      protein = 40;
      carbs = 15;
      fat = 35;
      sodium = 850;
    } else if (name.includes('soup')) {
      calories = 300;
      protein = 12;
      carbs = 28;
      fat = 12;
      sodium = 1200;
    }

    // Add some randomness
    calories += Math.floor(Math.random() * 100 - 50);
    protein += Math.floor(Math.random() * 10 - 5);
    carbs += Math.floor(Math.random() * 10 - 5);
    fat += Math.floor(Math.random() * 8 - 4);
    sodium += Math.floor(Math.random() * 200 - 100);

    return {
      calories: Math.max(100, calories),
      protein: Math.max(5, protein),
      carbs: Math.max(10, carbs),
      fat: Math.max(5, fat),
      sodium: Math.max(200, sodium),
    };
  }

  // Extract dietary tags from name and description
  private extractDietaryTags(name: string, description: string): string[] {
    const tags: string[] = [];
    const text = `${name} ${description}`.toLowerCase();

    if (text.includes('vegan')) tags.push('Vegan');
    if (text.includes('vegetarian')) tags.push('Vegetarian');
    if (text.includes('gluten free') || text.includes('gluten-free')) tags.push('GF');
    if (text.includes('dairy free') || text.includes('dairy-free')) tags.push('Dairy Free');
    if (text.includes('low sodium')) tags.push('Low Sodium');
    if (text.includes('halal')) tags.push('Halal');
    if (text.includes('kosher')) tags.push('Kosher');

    return tags;
  }
}
