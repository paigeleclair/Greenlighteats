import { MenuItem, UserPreferences, SafetyLevel, DEFAULT_MAX_SODIUM, DEFAULT_MAX_SUGAR } from '../types';

/**
 * Calculates the safety level of a menu item based on user preferences
 */
export function calculateSafetyLevel(
  item: MenuItem,
  preferences: UserPreferences
): SafetyLevel {
  let hasUnsafeViolation = false;
  let hasCautionViolation = false;

  // Check religious restrictions - these are UNSAFE violations
  if (preferences.religious.includes('halal') && item.notHalal) {
    hasUnsafeViolation = true;
  }
  
  if (preferences.religious.includes('kosher') && item.notKosher) {
    hasUnsafeViolation = true;
  }

  // Check allergens - these are UNSAFE violations
  if (item.allergens) {
    const hasAllergen = item.allergens.some(allergen => 
      preferences.allergens.includes(allergen)
    );
    if (hasAllergen) {
      hasUnsafeViolation = true;
    }
  }

  // Check dietary restrictions
  if (preferences.dietary.includes('vegetarian') && item.notVegetarian) {
    hasUnsafeViolation = true;
  }
  
  if (preferences.dietary.includes('vegan') && item.notVegan) {
    hasUnsafeViolation = true;
  }

  // Check sodium levels
  const maxSodium = preferences.maxSodium ?? DEFAULT_MAX_SODIUM;
  
  if (item.nutrition.sodium > maxSodium * 1.5) {
    hasUnsafeViolation = true;
  } else if (item.nutrition.sodium > maxSodium) {
    hasCautionViolation = true;
  }

  // Check sugar levels
  const maxSugar = preferences.maxSugar ?? DEFAULT_MAX_SUGAR;
  
  if (item.nutrition.sugar > maxSugar * 1.5) {
    hasUnsafeViolation = true;
  } else if (item.nutrition.sugar > maxSugar) {
    hasCautionViolation = true;
  }

  // Return the most severe violation
  if (hasUnsafeViolation) return 'unsafe';
  if (hasCautionViolation) return 'caution';
  return 'safe';
}

/**
 * Filters and scores restaurants based on how many safe items they have
 */
export function scoreRestaurant(
  menuItems: MenuItem[],
  preferences: UserPreferences
): SafetyLevel {
  const safeItems = menuItems.filter(
    item => calculateSafetyLevel(item, preferences) === 'safe'
  ).length;
  
  const cautionItems = menuItems.filter(
    item => calculateSafetyLevel(item, preferences) === 'caution'
  ).length;

  const total = menuItems.length;
  const safePercentage = (safeItems / total) * 100;
  
  if (safePercentage >= 50) return 'safe';
  if (safePercentage >= 25 || cautionItems > 0) return 'caution';
  return 'unsafe';
}

/**
 * Calculate the percentage of safe menu items
 */
export function calculateSafePercentage(
  menuItems: MenuItem[],
  preferences: UserPreferences
): number {
  if (menuItems.length === 0) return 0;
  
  const safeItems = menuItems.filter(
    item => calculateSafetyLevel(item, preferences) === 'safe'
  ).length;
  
  return Math.round((safeItems / menuItems.length) * 100);
}

/**
 * Get detailed safety information for a menu item
 */
export function getSafetyDetails(
  item: MenuItem,
  preferences: UserPreferences
): {
  safetyLevel: SafetyLevel;
  reasons: string[];
  exceedsBy?: { sodium: number; sugar: number };
} {
  const maxSodium = preferences.maxSodium ?? DEFAULT_MAX_SODIUM;
  const maxSugar = preferences.maxSugar ?? DEFAULT_MAX_SUGAR;
  const reasons: string[] = [];
  let safetyLevel: SafetyLevel = 'safe';
  let exceedsBy: { sodium: number; sugar: number } | undefined;
  let hasUnsafeViolation = false;
  let hasCautionViolation = false;

  // Check religious restrictions
  if (preferences.religious.includes('halal') && item.notHalal) {
    hasUnsafeViolation = true;
    reasons.push('❌ Not Halal - Contains pork or alcohol');
  }
  
  if (preferences.religious.includes('kosher') && item.notKosher) {
    hasUnsafeViolation = true;
    reasons.push('❌ Not Kosher - Not kosher certified');
  }

  // Check allergens
  if (item.allergens && item.allergens.length > 0) {
    const userAllergens = item.allergens.filter(allergen => 
      preferences.allergens.includes(allergen)
    );
    
    if (userAllergens.length > 0) {
      hasUnsafeViolation = true;
      userAllergens.forEach(allergen => {
        const allergenName = allergen.charAt(0).toUpperCase() + allergen.slice(1);
        reasons.push(`❌ Contains ${allergenName}`);
      });
    }
  }

  // Check dietary restrictions
  if (preferences.dietary.includes('vegetarian') && item.notVegetarian) {
    hasUnsafeViolation = true;
    reasons.push('❌ Not Vegetarian - Contains meat');
  }
  
  if (preferences.dietary.includes('vegan') && item.notVegan) {
    hasUnsafeViolation = true;
    reasons.push('❌ Not Vegan - Contains animal products');
  }
  
  // Check sodium levels
  if (item.nutrition.sodium > maxSodium * 1.5) {
    hasUnsafeViolation = true;
    const excess = item.nutrition.sodium - maxSodium;
    exceedsBy = { sodium: excess, sugar: 0 };
    reasons.push(`❌ High Sodium: ${item.nutrition.sodium}mg (${excess}mg over your ${maxSodium}mg limit)`);
  } else if (item.nutrition.sodium > maxSodium) {
    hasCautionViolation = true;
    const excess = item.nutrition.sodium - maxSodium;
    exceedsBy = { sodium: excess, sugar: 0 };
    reasons.push(`⚠️ Elevated Sodium: ${item.nutrition.sodium}mg (${excess}mg over your ${maxSodium}mg limit)`);
  } else {
    reasons.push(`✅ Sodium: ${item.nutrition.sodium}mg (within your ${maxSodium}mg limit)`);
  }

  // Check sugar levels
  if (item.nutrition.sugar > maxSugar * 1.5) {
    hasUnsafeViolation = true;
    const excess = item.nutrition.sugar - maxSugar;
    exceedsBy = { sodium: 0, sugar: excess };
    reasons.push(`❌ High Sugar: ${item.nutrition.sugar}g (${excess}g over your ${maxSugar}g limit)`);
  } else if (item.nutrition.sugar > maxSugar) {
    hasCautionViolation = true;
    const excess = item.nutrition.sugar - maxSugar;
    exceedsBy = { sodium: 0, sugar: excess };
    reasons.push(`⚠️ Elevated Sugar: ${item.nutrition.sugar}g (${excess}g over your ${maxSugar}g limit)`);
  } else {
    reasons.push(`✅ Sugar: ${item.nutrition.sugar}g (within your ${maxSugar}g limit)`);
  }

  // Determine final safety level
  if (hasUnsafeViolation) {
    safetyLevel = 'unsafe';
  } else if (hasCautionViolation) {
    safetyLevel = 'caution';
  }
  
  return { safetyLevel, reasons, exceedsBy };
}