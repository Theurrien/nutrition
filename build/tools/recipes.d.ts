import { CalculateRecipeNutritionParams, Component, Ingredient, Language, Value } from '../api/types.js';
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
