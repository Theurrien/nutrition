import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { NutritionApiClient } from '../api/client.js';
import { formatValueWithUnit, translate } from '../utils/i18n.js';
import { DEFAULT_LANGUAGE } from '../utils/language.js';
import { getNutritionalValues } from './nutrition.js';
// Create an instance of the API client
const apiClient = new NutritionApiClient();
/**
 * Get ingredients for a specific recipe
 * @param params Parameters for retrieving ingredients
 * @returns Array of ingredients
 */
export async function getIngredients(params) {
    const { recipeId, language = DEFAULT_LANGUAGE } = params;
    try {
        // First get the DBID from the recipe ID if they're different
        let dbid = recipeId;
        try {
            dbid = await apiClient.getFoodDBID(recipeId);
        }
        catch {
            // If getFoodDBID fails, use the original recipeId as the DBID
            dbid = recipeId;
        }
        const ingredientsParams = {
            DBID: dbid,
            lang: language
        };
        const ingredients = await apiClient.getIngredients(ingredientsParams);
        if (!ingredients || ingredients.length === 0) {
            throw new McpError(ErrorCode.InvalidRequest, `No ingredients found for recipe ID ${recipeId}`);
        }
        return ingredients;
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `${translate('error.api', language)}: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Calculate nutritional totals for a custom recipe
 * @param params Parameters for calculating recipe nutrition
 * @returns Combined nutritional values for the recipe
 */
export async function calculateRecipeNutrition(params) {
    const { ingredients, language = DEFAULT_LANGUAGE } = params;
    if (!ingredients || ingredients.length === 0) {
        throw new McpError(ErrorCode.InvalidParams, 'At least one ingredient is required for recipe analysis');
    }
    try {
        // Get component sets to find the primary set (usually macronutrients)
        const componentSets = await apiClient.getSets(language);
        if (!componentSets || componentSets.length === 0) {
            throw new McpError(ErrorCode.InternalError, 'Failed to retrieve component sets');
        }
        // Use the first component set by default (typically represents main nutrients)
        const componentSetId = componentSets[0].id;
        // Get nutritional values for each ingredient
        const ingredientDetails = await Promise.all(ingredients.map(async (ingredient) => {
            try {
                // Get food details to get the name
                const food = await apiClient.getFoodByDBID(ingredient.foodId, language);
                // Get nutritional values
                const nutritionalValues = await getNutritionalValues({
                    foodId: ingredient.foodId,
                    componentSetId,
                    language
                });
                return {
                    name: food.name,
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                    nutritionalValues
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new McpError(ErrorCode.InternalError, `Error processing ingredient ${ingredient.foodId}: ${error.message}`);
                }
                throw error;
            }
        }));
        // Calculate combined nutritional values
        const componentsMap = new Map();
        // Process each ingredient
        ingredientDetails.forEach(ingredient => {
            const { amount, nutritionalValues } = ingredient;
            // Process each nutritional value
            nutritionalValues.forEach(value => {
                const componentName = value.component.name;
                const componentId = value.component.id;
                // Skip if the value is not a number or is zero
                const numValue = typeof value.value === 'string'
                    ? parseFloat(value.value)
                    : value.value;
                if (isNaN(numValue) || numValue === 0) {
                    return;
                }
                // Get the unit
                const unit = typeof value.unit === 'string'
                    ? value.unit
                    : value.unit.name;
                // Calculate the contribution of this ingredient to the total
                const contribution = numValue * (amount / 100); // Assuming amounts are in g and values are per 100g
                // Add to the total
                if (componentsMap.has(componentName)) {
                    const existingValue = componentsMap.get(componentName);
                    existingValue.value += contribution;
                }
                else {
                    componentsMap.set(componentName, {
                        component: value.component,
                        value: contribution,
                        unit
                    });
                }
            });
        });
        // Convert the map to an array and format the values
        const totalValues = Array.from(componentsMap.values()).map(item => ({
            component: item.component,
            value: item.value,
            formattedValue: formatValueWithUnit(item.value, item.unit, language),
            unit: item.unit
        }));
        // Sort by component ID for consistent order
        totalValues.sort((a, b) => a.component.id - b.component.id);
        return {
            ingredients: ingredientDetails,
            totalValues
        };
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `${translate('error.api', language)}: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Search for recipes in the database
 * @param params Parameters for searching recipes
 * @returns Array of recipe objects with their details
 */
export async function searchRecipes(params) {
    const { query, language = DEFAULT_LANGUAGE, limit = 20 } = params;
    try {
        // First, search for foods with the given query
        const searchParams = {
            search: query,
            lang: language,
            limit
        };
        const searchResults = await apiClient.searchFoods(searchParams);
        if (!searchResults || searchResults.length === 0) {
            return [];
        }
        // Fetch full details for each result and filter for recipes
        const detailedResults = await Promise.all(searchResults.map(async (result) => {
            try {
                return await apiClient.getFoodByDBID(result.id, language);
            }
            catch (error) {
                console.error(`Error fetching details for food ID ${result.id}:`, error);
                return null;
            }
        }));
        // Filter out null results and non-recipes
        const recipes = detailedResults
            .filter((food) => food !== null && food.isrecipe === true);
        return recipes;
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `${translate('error.api', language)}: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Get nutritional information for a specific recipe
 * @param params Parameters for retrieving recipe nutrition
 * @returns Nutritional breakdown of the recipe
 */
export async function getRecipeNutrition(params) {
    const { recipeId, language = DEFAULT_LANGUAGE } = params;
    try {
        // First, get the recipe details to verify it's a recipe
        const recipe = await apiClient.getFoodByDBID(recipeId, language);
        if (!recipe.isrecipe) {
            throw new McpError(ErrorCode.InvalidRequest, `Food ID ${recipeId} is not a recipe`);
        }
        // Get the recipe ingredients
        const ingredients = await getIngredients({ recipeId, language });
        // Convert the ingredients to the format expected by calculateRecipeNutrition
        const ingredientParams = ingredients.map(ingredient => ({
            foodId: ingredient.foodid.id,
            amount: ingredient.amount,
            unit: ingredient.unit
        }));
        // Calculate the nutritional values
        const nutritionResult = await calculateRecipeNutrition({
            ingredients: ingredientParams,
            language
        });
        return nutritionResult;
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `${translate('error.api', language)}: ${error.message}`);
        }
        throw error;
    }
}
//# sourceMappingURL=recipes.js.map