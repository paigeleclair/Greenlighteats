import { Restaurant, MenuItem, Friend } from '../types';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Green Bowl Kitchen',
    cuisine: 'Mediterranean',
    distance: '0.3 mi',
    rating: 4.8,
    safetyLevel: 'safe',
    dietaryTags: ['Halal', 'Vegan', 'GF'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'
  },
  {
    id: '2',
    name: 'Tokyo Ramen House',
    cuisine: 'Japanese',
    distance: '0.5 mi',
    rating: 4.6,
    safetyLevel: 'caution',
    dietaryTags: ['GF'],
    image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400'
  },
  {
    id: '3',
    name: 'Spice Route',
    cuisine: 'Indian',
    distance: '0.8 mi',
    rating: 4.7,
    safetyLevel: 'unsafe',
    dietaryTags: ['Vegan', 'Halal'],
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'
  },
  {
    id: '4',
    name: 'Fresh & Co',
    cuisine: 'Salads & Bowls',
    distance: '1.2 mi',
    rating: 4.5,
    safetyLevel: 'safe',
    dietaryTags: ['Vegan', 'GF', 'Low Sodium'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
  }
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Mediterranean Bowl',
    description: 'Quinoa, chickpeas, cucumber, tomato, tahini',
    price: 12.99,
    safetyLevel: 'safe',
    tags: ['GF', 'Vegan', 'Halal'],
    nutrition: {
      calories: 450,
      protein: 15,
      carbs: 58,
      fat: 18,
      sodium: 320
    },
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
  },
  {
    id: '2',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with herbs',
    price: 18.99,
    safetyLevel: 'caution',
    tags: ['GF'],
    nutrition: {
      calories: 380,
      protein: 34,
      carbs: 8,
      fat: 22,
      sodium: 580
    },
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400'
  },
  {
    id: '3',
    name: 'Classic Burger',
    description: 'Beef patty with cheese and sauce',
    price: 14.99,
    safetyLevel: 'unsafe',
    tags: [],
    nutrition: {
      calories: 720,
      protein: 28,
      carbs: 45,
      fat: 42,
      sodium: 890
    },
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  },
  {
    id: '4',
    name: 'Avocado Toast',
    description: 'Whole grain toast, smashed avocado, seeds',
    price: 9.99,
    safetyLevel: 'safe',
    tags: ['Vegan', 'Low Sodium'],
    nutrition: {
      calories: 320,
      protein: 8,
      carbs: 32,
      fat: 18,
      sodium: 240
    },
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400'
  }
];

export const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    restrictions: ['Vegan', 'Halal']
  },
  {
    id: '2',
    name: 'Alex Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    restrictions: ['GF', 'Low Sodium']
  },
  {
    id: '3',
    name: 'Maya Williams',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    restrictions: ['Kosher']
  },
  {
    id: '4',
    name: 'Jordan Lee',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    restrictions: ['Vegetarian']
  }
];
