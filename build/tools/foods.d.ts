import { Food, FoodWithNamesSynonymesCategories, Language } from '../api/types.js';
/**
 * Search for foods in the Swiss Nutrition Database
 * @param params Search parameters
 * @returns Array of matching foods
 */
export declare function searchFoods(params: {
    query?: string;
    language?: Language;
    foodType?: boolean;
    category?: number;
    limit?: number;
}): Promise<FoodWithNamesSynonymesCategories[]>;
/**
 * Get detailed information about a specific food
 * @param params Parameters with food ID and language
 * @returns Detailed food information
 */
export declare function getFoodDetails(params: {
    foodId: number;
    language?: Language;
}): Promise<Food>;
/**
 * Get categories with food counts that match search criteria
 * @param params Search parameters
 * @returns Array of categories with food counts
 */
export declare function getCategorizedFoods(params: {
    query?: string;
    language?: Language;
    foodType?: boolean;
    category?: number;
    limit?: number;
}): Promise<import("../api/types.js").CategoryWithNumberOfFoodDTO[]>;
/**
 * Get the top-level food categories
 * @param language Language code
 * @returns Array of top-level categories
 */
export declare function getTopCategories(language?: Language): Promise<import("../api/types.js").TopCategory[]>;
/**
 * Get subcategories for a top-level category
 * @param params Parameters with category ID and language
 * @returns Array of subcategories
 */
export declare function getSubcategories(params: {
    categoryId: number;
    language?: Language;
}): Promise<import("../api/types.js").Category[]>;
