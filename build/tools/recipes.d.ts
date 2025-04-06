import { CalculateRecipeNutritionParams, Component, Food, Ingredient, Language, Value } from '../api/types.js';
/**
 * Get ingredients for a specific recipe
 * @param params Parameters for retrieving ingredients
 * @returns Array of ingredients
 */
export declare function getIngredients(params: {
    recipeId: number;
    language?: Language;
}): Promise<Ingredient[]>;
/**
 * Calculate nutritional totals for a custom recipe
 * @param params Parameters for calculating recipe nutrition
 * @returns Combined nutritional values for the recipe
 */
export declare function calculateRecipeNutrition(params: CalculateRecipeNutritionParams): Promise<{
    ingredients: Array<{
        name: string;
        amount: number;
        unit: string;
        nutritionalValues: Value[];
    }>;
    totalValues: Array<{
        component: Component;
        value: number;
        formattedValue: string;
        unit: string;
    }>;
}>;
/**
 * Search for recipes in the database
 * @param params Parameters for searching recipes
 * @returns Array of recipe objects with their details
 */
export declare function searchRecipes(params: {
    query: string;
    language?: Language;
    limit?: number;
}): Promise<Food[]>;
/**
 * Get nutritional information for a specific recipe
 * @param params Parameters for retrieving recipe nutrition
 * @returns Nutritional breakdown of the recipe
 */
export declare function getRecipeNutrition(params: {
    recipeId: number;
    language?: Language;
}): Promise<{
    ingredients: Array<{
        name: string;
        amount: number;
        unit: string;
        nutritionalValues: Value[];
    }>;
    totalValues: Array<{
        component: Component;
        value: number;
        formattedValue: string;
        unit: string;
    }>;
}>;
