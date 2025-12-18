import { projectId, publicAnonKey } from './supabase/info';
import { Restaurant, MenuItem } from '../types';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-d61ee9e1`;

interface SearchParams {
  lat?: number;
  lon?: number;
  distance?: number;
  state?: string;
  zipCode?: string;
  cuisine?: string;
  size?: number;
  page?: number;
  fullmenu?: boolean;
}

interface RestaurantSearchResult {
  restaurants: Restaurant[];
  total: number;
  page: number;
}

interface RestaurantDetailResult {
  restaurant: Restaurant;
  menuItems: MenuItem[];
}

/**
 * Search restaurants by geographic location
 */
export async function searchRestaurantsByLocation(
  lat: number,
  lon: number,
  distance: number = 5,
  options: { cuisine?: string; size?: number; page?: number } = {}
): Promise<RestaurantSearchResult> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    distance: distance.toString(),
    ...(options.cuisine && { cuisine: options.cuisine }),
    ...(options.size && { size: options.size.toString() }),
    ...(options.page && { page: options.page.toString() }),
  });

  // Searching restaurants near location

  const response = await fetch(`${API_BASE}/restaurants/search?${params}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to search restaurants';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch (e) {
      // Response is not JSON (likely HTML error page)
      const text = await response.text();
      console.error('❌ Non-JSON response from server:', text.substring(0, 200));
      errorMessage = `Server error (${response.status}): ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}

/**
 * Get restaurants by state
 */
export async function getRestaurantsByState(
  state: string,
  options: { cuisine?: string; size?: number; page?: number; fullmenu?: boolean } = {}
): Promise<RestaurantSearchResult> {
  const params = new URLSearchParams({
    ...(options.cuisine && { cuisine: options.cuisine }),
    ...(options.size && { size: options.size.toString() }),
    ...(options.page && { page: options.page.toString() }),
    ...(options.fullmenu && { fullmenu: 'true' }),
  });

  const response = await fetch(`${API_BASE}/restaurants/state/${state}?${params}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to get restaurants by state';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch (e) {
      const text = await response.text();
      console.error('Non-JSON response from server:', text.substring(0, 200));
      errorMessage = `Server error (${response.status}): ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

/**
 * Get restaurants by zip code
 */
export async function getRestaurantsByZipCode(
  zipCode: string,
  options: { cuisine?: string; size?: number; page?: number; fullmenu?: boolean } = {}
): Promise<RestaurantSearchResult> {
  const params = new URLSearchParams({
    ...(options.cuisine && { cuisine: options.cuisine }),
    ...(options.size && { size: options.size.toString() }),
    ...(options.page && { page: options.page.toString() }),
    ...(options.fullmenu && { fullmenu: 'true' }),
  });

  const response = await fetch(`${API_BASE}/restaurants/zip/${zipCode}?${params}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to get restaurants by zip code';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch (e) {
      const text = await response.text();
      console.error('Non-JSON response from server:', text.substring(0, 200));
      errorMessage = `Server error (${response.status}): ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

/**
 * Get a single restaurant with full menu
 */
export async function getRestaurantDetail(restaurantId: string): Promise<RestaurantDetailResult> {
  const response = await fetch(`${API_BASE}/restaurant/${restaurantId}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to get restaurant details';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch (e) {
      const text = await response.text();
      console.error('Non-JSON response from server:', text.substring(0, 200));
      errorMessage = `Server error (${response.status}): ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}
