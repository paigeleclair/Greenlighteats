import { Restaurant, MenuItem } from '../types';

// Real restaurant chains with realistic menu data based on actual nutritional information

export const realRestaurants: Restaurant[] = [
  {
    id: 'carrabbas-1',
    name: "Carrabba's Italian Grill",
    cuisine: 'Italian',
    distance: '0.4 mi',
    rating: 4.6,
    safetyLevel: 'caution',
    dietaryTags: ['GF options', 'Vegetarian'],
    image: 'https://tse4.mm.bing.net/th/id/OIP.jfCMmb97W3Ju1TF04R31OgHaE8?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    id: 'olive-garden-1',
    name: 'Olive Garden',
    cuisine: 'Italian',
    distance: '0.6 mi',
    rating: 4.4,
    safetyLevel: 'caution',
    dietaryTags: ['GF options', 'Vegetarian'],
    image: 'https://th.bing.com/th/id/R.4cd02124b7fa9c3925c180354a5dad0d?rik=6Rs2IbqjgLdRVA&pid=ImgRaw&r=0'
  },
  {
    id: 'outback-1',
    name: 'Outback Steakhouse',
    cuisine: 'Steakhouse',
    distance: '0.8 mi',
    rating: 4.5,
    safetyLevel: 'unsafe',
    dietaryTags: ['GF options'],
    image: 'https://www.visitbn.org/app/uploads/2017/02/Screen-Shot-2017-02-02-at-12.05.49-PM-800x500.png'
  },
  {
    id: 'panera-1',
    name: 'Panera Bread',
    cuisine: 'Bakery & Cafe',
    distance: '0.3 mi',
    rating: 4.3,
    safetyLevel: 'safe',
    dietaryTags: ['Vegetarian', 'Vegan options', 'Low Sodium'],
    image: 'https://th.bing.com/th/id/R.996e37df852db5c32f7b922f16b899f7?rik=P0ihamsaNP9Bbg&riu=http%3a%2f%2fwww.logotypes101.com%2flogos%2f905%2fBD991955BF1F199F0B394306D1A61043%2fpanera_bread.png&ehk=LnKUzcC%2brKh5%2fIVL6HIz49HAouk%2bSQGQov3HQB5Qas4%3d&risl=&pid=ImgRaw&r=0'
  },
  {
    id: 'chipotle-1',
    name: 'Chipotle Mexican Grill',
    cuisine: 'Mexican',
    distance: '0.5 mi',
    rating: 4.2,
    safetyLevel: 'safe',
    dietaryTags: ['Vegan', 'GF options', 'Halal'],
    image: 'https://th.bing.com/th/id/R.c3f3a6634ecc1eda364ffd6810bf084d?rik=0SQ11R1UIu2uBQ&riu=http%3a%2f%2fappropriateomnivore.com%2fwp-content%2fuploads%2f2016%2f02%2fChipotle-1.jpg&ehk=AUy99HLffQoiwR1772yWw25FBOxtVbXxU%2bBXycH2mSE%3d&risl=&pid=ImgRaw&r=0'
  },
  {
    id: 'cheesecake-1',
    name: 'The Cheesecake Factory',
    cuisine: 'American',
    distance: '1.1 mi',
    rating: 4.5,
    safetyLevel: 'unsafe',
    dietaryTags: ['GF options', 'Vegetarian'],
    image: 'https://amazingfoodanddrink.com/wp-content/uploads/2024/04/the-cheesecake-factory-scaled.jpg'
  },
  {
    id: 'chick-fil-a-1',
    name: 'Chick-fil-A',
    cuisine: 'Fast Food',
    distance: '0.7 mi',
    rating: 4.7,
    safetyLevel: 'caution',
    dietaryTags: ['GF options'],
    image: 'https://th.bing.com/th/id/R.38e4419c8a0427bcfdf62188d115197f?rik=oMSDOsz0YsHlBg&riu=http%3a%2f%2fcliparts.co%2fcliparts%2friL%2fxMX%2friLxMXqrT.jpg&ehk=IigJD%2bQKg3O3C22uO4vdgvg7egUcQpnqYaYh4stFYIY%3d&risl=&pid=ImgRaw&r=0'
  },
  {
    id: 'pf-changs-1',
    name: "P.F. Chang's",
    cuisine: 'Asian',
    distance: '0.9 mi',
    rating: 4.4,
    safetyLevel: 'caution',
    dietaryTags: ['GF options', 'Vegetarian', 'Vegan options'],
    image: 'https://th.bing.com/th/id/R.1216956804777aeb0ad99e743117ec77?rik=Fh4ELmlBW6ARUg&pid=ImgRaw&r=0'
  }
];

// Menu items for each restaurant with realistic nutritional data
export const restaurantMenus: { [restaurantId: string]: MenuItem[] } = {
  'carrabbas-1': [
    {
      id: 'carr-1',
      name: 'Chicken Bryan',
      description: 'Wood-grilled chicken topped with goat cheese, sun-dried tomatoes, basil, lemon butter',
      price: 19.99,
      safetyLevel: 'caution',
      tags: ['GF'],
      nutrition: {
        calories: 710,
        protein: 52,
        carbs: 12,
        fat: 52,
        sodium: 1490,
        sugar: 6
      },
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
      allergens: ['dairy'],
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'carr-2',
      name: 'Lasagne',
      description: 'Fresh pasta layered with bolognese meat sauce, ricotta, mozzarella',
      price: 17.99,
      safetyLevel: 'unsafe',
      tags: [],
      nutrition: {
        calories: 1100,
        protein: 48,
        carbs: 89,
        fat: 58,
        sodium: 2350,
        sugar: 12
      },
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400',
      allergens: ['gluten', 'dairy', 'eggs'],
      notHalal: true,
      notKosher: true,
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'carr-3',
      name: 'Pollo Rosa Maria',
      description: 'Wood-grilled chicken stuffed with fontina cheese, prosciutto, mushrooms',
      price: 21.99,
      safetyLevel: 'unsafe',
      tags: ['GF'],
      nutrition: {
        calories: 890,
        protein: 64,
        carbs: 18,
        fat: 62,
        sodium: 2180,
        sugar: 7
      },
      image: 'https://images.unsplash.com/photo-1633237308525-cd587cf71926?w=400',
      allergens: ['dairy'],
      notHalal: true,
      notKosher: true,
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'carr-4',
      name: 'Sogno di Cioccolata',
      description: 'Chocolate dream cake',
      price: 8.99,
      safetyLevel: 'unsafe',
      tags: [],
      nutrition: {
        calories: 1180,
        protein: 13,
        carbs: 142,
        fat: 65,
        sodium: 520,
        sugar: 95
      },
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      allergens: ['gluten', 'dairy', 'eggs'],
      notVegan: true
    },
    {
      id: 'carr-5',
      name: 'Insalata Carrabba',
      description: 'Mixed greens, tomatoes, olives, red onions with house dressing',
      price: 9.99,
      safetyLevel: 'safe',
      tags: ['Vegetarian', 'GF'],
      nutrition: {
        calories: 280,
        protein: 8,
        carbs: 22,
        fat: 18,
        sodium: 420,
        sugar: 8
      },
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
    }
  ],
  'olive-garden-1': [
    {
      id: 'og-1',
      name: 'Chicken Alfredo',
      description: 'Fettuccine with creamy alfredo sauce and grilled chicken',
      price: 16.99,
      safetyLevel: 'unsafe',
      tags: [],
      nutrition: {
        calories: 1570,
        protein: 68,
        carbs: 101,
        fat: 97,
        sodium: 1850,
        sugar: 14
      },
      image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400',
      allergens: ['gluten', 'dairy'],
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'og-2',
      name: 'Tour of Italy',
      description: 'Lasagna, fettuccine alfredo, and chicken parmigiana',
      price: 19.99,
      safetyLevel: 'unsafe',
      tags: [],
      nutrition: {
        calories: 1520,
        protein: 74,
        carbs: 107,
        fat: 85,
        sodium: 3830,
        sugar: 18
      },
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
      allergens: ['gluten', 'dairy', 'eggs'],
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'og-3',
      name: 'Herb-Grilled Salmon',
      description: 'Grilled salmon filet with garlic herb butter',
      price: 22.99,
      safetyLevel: 'caution',
      tags: ['GF'],
      nutrition: {
        calories: 510,
        protein: 46,
        carbs: 11,
        fat: 31,
        sodium: 760,
        sugar: 4
      },
      image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400',
      allergens: ['fish', 'dairy'],
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'og-4',
      name: 'Minestrone Soup',
      description: 'Fresh vegetables, beans and pasta in a tomato broth',
      price: 6.99,
      safetyLevel: 'safe',
      tags: ['Vegetarian', 'Vegan'],
      nutrition: {
        calories: 110,
        protein: 4,
        carbs: 19,
        fat: 2,
        sodium: 520,
        sugar: 6
      },
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'
    },
    {
      id: 'og-5',
      name: 'Zuppa Toscana',
      description: 'Spicy sausage, russet potatoes, kale in creamy broth',
      price: 6.99,
      safetyLevel: 'unsafe',
      tags: ['GF'],
      nutrition: {
        calories: 220,
        protein: 9,
        carbs: 18,
        fat: 13,
        sodium: 1240,
        sugar: 4
      },
      image: 'https://images.unsplash.com/photo-1588566565463-180a5b2090d2?w=400',
      allergens: ['dairy'],
      notHalal: true,
      notKosher: true,
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'og-6',
      name: 'House Salad (no dressing)',
      description: 'Fresh lettuce, tomatoes, olives, red onion, croutons',
      price: 7.99,
      safetyLevel: 'safe',
      tags: ['Vegetarian'],
      nutrition: {
        calories: 150,
        protein: 6,
        carbs: 21,
        fat: 5,
        sodium: 310,
        sugar: 5
      },
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
      allergens: ['gluten']
    }
  ],
  'outback-1': [
    {
      id: 'out-1',
      name: 'Outback Special Sirloin',
      description: '6 oz center-cut sirloin',
      price: 16.99,
      safetyLevel: 'unsafe',
      tags: ['GF'],
      nutrition: {
        calories: 288,
        protein: 33,
        carbs: 0,
        fat: 17,
        sodium: 1044,
        sugar: 0
      },
      image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'out-2',
      name: 'Bloomin Onion',
      description: 'Colossal onion, breaded and deep fried',
      price: 9.99,
      safetyLevel: 'unsafe',
      tags: [],
      nutrition: {
        calories: 1950,
        protein: 18,
        carbs: 123,
        fat: 155,
        sodium: 3840,
        sugar: 15
      },
      image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400',
      allergens: ['gluten', 'eggs', 'dairy']
    },
    {
      id: 'out-3',
      name: 'Grilled Chicken on the Barbie',
      description: 'Seasoned and wood-fire grilled chicken breast',
      price: 15.99,
      safetyLevel: 'caution',
      tags: ['GF'],
      nutrition: {
        calories: 373,
        protein: 59,
        carbs: 3,
        fat: 13,
        sodium: 845,
        sugar: 2
      },
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400',
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'out-4',
      name: 'House Salad (no dressing)',
      description: 'Fresh mixed greens, tomatoes, cheese, croutons',
      price: 5.99,
      safetyLevel: 'safe',
      tags: ['Vegetarian'],
      nutrition: {
        calories: 234,
        protein: 12,
        carbs: 14,
        fat: 14,
        sodium: 488,
        sugar: 6
      },
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
      allergens: ['gluten', 'dairy'],
      notVegan: true
    }
  ],
  'panera-1': [
    {
      id: 'pan-1',
      name: 'Mediterranean Grain Bowl',
      description: 'Quinoa, arugula, tomatoes, cucumber, hummus, feta',
      price: 11.99,
      safetyLevel: 'safe',
      tags: ['Vegetarian'],
      nutrition: {
        calories: 500,
        protein: 17,
        carbs: 62,
        fat: 20,
        sodium: 570,
        sugar: 9
      },
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      allergens: ['dairy'],
      notVegan: true
    },
    {
      id: 'pan-2',
      name: 'Broccoli Cheddar Soup (Cup)',
      description: 'Chopped broccoli, shredded carrots, select seasonings',
      price: 6.99,
      safetyLevel: 'caution',
      tags: ['Vegetarian'],
      nutrition: {
        calories: 230,
        protein: 9,
        carbs: 16,
        fat: 15,
        sodium: 820,
        sugar: 5
      },
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
      allergens: ['dairy'],
      notVegan: true
    },
    {
      id: 'pan-3',
      name: 'Classic Grilled Cheese',
      description: 'American cheese on sourdough bread',
      price: 7.99,
      safetyLevel: 'caution',
      tags: ['Vegetarian'],
      nutrition: {
        calories: 640,
        protein: 24,
        carbs: 57,
        fat: 34,
        sodium: 1220,
        sugar: 8
      },
      image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400',
      allergens: ['gluten', 'dairy'],
      notVegan: true
    },
    {
      id: 'pan-4',
      name: 'Ten Vegetable Soup',
      description: 'Tomatoes, red peppers, corn, poblano peppers, and more',
      price: 6.99,
      safetyLevel: 'safe',
      tags: ['Vegetarian', 'Vegan'],
      nutrition: {
        calories: 100,
        protein: 4,
        carbs: 20,
        fat: 1,
        sodium: 460,
        sugar: 7
      },
      image: 'https://images.unsplash.com/photo-1588566565463-180a5b2090d2?w=400'
    }
  ],
  'chipotle-1': [
    {
      id: 'chip-1',
      name: 'Chicken Burrito Bowl',
      description: 'Rice, black beans, chicken, fajita veggies, salsa, cheese',
      price: 10.99,
      safetyLevel: 'caution',
      tags: ['GF'],
      nutrition: {
        calories: 630,
        protein: 48,
        carbs: 67,
        fat: 18,
        sodium: 1320,
        sugar: 10
      },
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
      allergens: ['dairy'],
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'chip-2',
      name: 'Veggie Bowl',
      description: 'Rice, black beans, fajita veggies, guacamole, salsa',
      price: 10.49,
      safetyLevel: 'safe',
      tags: ['Vegan', 'GF'],
      nutrition: {
        calories: 550,
        protein: 16,
        carbs: 75,
        fat: 21,
        sodium: 555,
        sugar: 8
      },
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
    },
    {
      id: 'chip-3',
      name: 'Steak Burrito',
      description: 'Flour tortilla, rice, beans, steak, cheese, sour cream',
      price: 11.99,
      safetyLevel: 'unsafe',
      tags: [],
      nutrition: {
        calories: 945,
        protein: 52,
        carbs: 101,
        fat: 34,
        sodium: 2050,
        sugar: 11
      },
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
      allergens: ['gluten', 'dairy'],
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'chip-4',
      name: 'Sofritas Bowl',
      description: 'Rice, pinto beans, organic tofu, veggies, salsa',
      price: 10.49,
      safetyLevel: 'safe',
      tags: ['Vegan', 'GF'],
      nutrition: {
        calories: 500,
        protein: 19,
        carbs: 68,
        fat: 16,
        sodium: 580,
        sugar: 9
      },
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      allergens: ['soy']
    }
  ],
  'cheesecake-1': [
    {
      id: 'cf-1',
      name: 'Chicken Madeira',
      description: 'Sautéed chicken breast, fresh asparagus, mashed potatoes',
      price: 24.99,
      safetyLevel: 'unsafe',
      tags: [],
      nutrition: {
        calories: 1320,
        protein: 75,
        carbs: 68,
        fat: 78,
        sodium: 2590,
        sugar: 12
      },
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
      allergens: ['dairy', 'gluten'],
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'cf-2',
      name: 'Factory Chopped Salad',
      description: 'Chicken, avocado, tomatoes, egg, bacon, cheese',
      price: 16.99,
      safetyLevel: 'unsafe',
      tags: ['GF'],
      nutrition: {
        calories: 870,
        protein: 48,
        carbs: 18,
        fat: 65,
        sodium: 1540,
        sugar: 7
      },
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
      allergens: ['eggs', 'dairy'],
      notHalal: true,
      notKosher: true,
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'cf-3',
      name: 'Grilled Salmon',
      description: 'Fresh grilled salmon with vegetables',
      price: 28.99,
      safetyLevel: 'caution',
      tags: ['GF'],
      nutrition: {
        calories: 720,
        protein: 54,
        carbs: 28,
        fat: 42,
        sodium: 940,
        sugar: 8
      },
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
      allergens: ['fish'],
      notVegetarian: true,
      notVegan: true
    }
  ],
  'chick-fil-a-1': [
    {
      id: 'cfa-1',
      name: 'Grilled Chicken Sandwich',
      description: 'Grilled chicken breast on multigrain bun',
      price: 6.99,
      safetyLevel: 'caution',
      tags: [],
      nutrition: {
        calories: 380,
        protein: 28,
        carbs: 44,
        fat: 12,
        sodium: 820,
        sugar: 9
      },
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
      allergens: ['gluten'],
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'cfa-2',
      name: 'Grilled Chicken Nuggets (12 count)',
      description: 'Bite-sized grilled chicken breast',
      price: 8.99,
      safetyLevel: 'safe',
      tags: ['GF'],
      nutrition: {
        calories: 200,
        protein: 38,
        carbs: 2,
        fat: 5,
        sodium: 440,
        sugar: 1
      },
      image: 'https://images.unsplash.com/photo-1562059390-a761a084768e?w=400',
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'cfa-3',
      name: 'Kale Crunch Side Salad',
      description: 'Kale and cabbage blend with apple cider vinaigrette',
      price: 4.99,
      safetyLevel: 'safe',
      tags: ['Vegetarian'],
      nutrition: {
        calories: 170,
        protein: 4,
        carbs: 20,
        fat: 9,
        sodium: 210,
        sugar: 11
      },
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      allergens: ['tree-nuts']
    },
    {
      id: 'cfa-4',
      name: 'Waffle Potato Fries (Medium)',
      description: 'Crispy waffle-shaped potatoes',
      price: 2.99,
      safetyLevel: 'caution',
      tags: ['Vegetarian'],
      nutrition: {
        calories: 420,
        protein: 5,
        carbs: 45,
        fat: 24,
        sodium: 280,
        sugar: 1
      },
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'
    }
  ],
  'pf-changs-1': [
    {
      id: 'pfc-1',
      name: 'Buddha\'s Feast (Steamed)',
      description: 'Steamed mixed vegetables with brown rice',
      price: 14.99,
      safetyLevel: 'safe',
      tags: ['Vegan', 'GF'],
      nutrition: {
        calories: 380,
        protein: 12,
        carbs: 72,
        fat: 6,
        sodium: 420,
        sugar: 14
      },
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
    },
    {
      id: 'pfc-2',
      name: 'Mongolian Beef',
      description: 'Sweet soy glaze, scallions, garlic',
      price: 19.99,
      safetyLevel: 'unsafe',
      tags: ['GF'],
      nutrition: {
        calories: 1180,
        protein: 56,
        carbs: 87,
        fat: 62,
        sodium: 3840,
        sugar: 28
      },
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
      allergens: ['soy'],
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'pfc-3',
      name: 'Ginger Chicken with Broccoli',
      description: 'Chicken, ginger, broccoli, garlic',
      price: 17.99,
      safetyLevel: 'unsafe',
      tags: ['GF'],
      nutrition: {
        calories: 660,
        protein: 42,
        carbs: 51,
        fat: 30,
        sodium: 2280,
        sugar: 18
      },
      image: 'https://images.unsplash.com/photo-1603073163308-9c6f7a1e5d98?w=400',
      allergens: ['soy'],
      notVegetarian: true,
      notVegan: true
    },
    {
      id: 'pfc-4',
      name: 'Asian Grilled Salmon',
      description: 'Norwegian salmon, vegetables, spinach',
      price: 22.99,
      safetyLevel: 'caution',
      tags: ['GF'],
      nutrition: {
        calories: 550,
        protein: 48,
        carbs: 24,
        fat: 28,
        sodium: 980,
        sugar: 12
      },
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
      allergens: ['fish', 'soy'],
      notVegetarian: true,
      notVegan: true
    }
  ]
};
