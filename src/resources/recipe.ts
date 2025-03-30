import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { NutritionApiClient } from '../api/client.js';
import { Language } from '../api/types.js';
import { calculateRecipeNutrition, getIngredients } from '../tools/index.js';
import { DEFAULT_LANGUAGE } from '../utils/language.js';

// Create an instance of the API client
const apiClient = new NutritionApiClient();

/**
 * Resource URI templates for recipe-related resources
 */
export const recipeResourceTemplates = [
  {
    uriTemplate: 'nutrition://recipe/{recipeId}',
    name: 'Recipe details by ID',
    description: 'Get detailed information about a recipe by its database ID',
    mimeType: 'application/json'
  },
  {
    uriTemplate: 'nutrition://recipe/{recipeId}/ingredients',
    name: 'Recipe ingredients',
    description: 'Get the ingredients of a recipe by its database ID',
    mimeType: 'application/json'
  },
  {
    uriTemplate: 'nutrition://recipe/{recipeId}/nutrition',
    name: 'Recipe nutritional values',
    description: 'Get the nutritional values of a recipe by its database ID',
    mimeType: 'application/json'
  }
];

/**
 * Handle recipe resource requests
 * @param uri The requested resource URI
 * @param language The language to use for the response
 * @returns The resource contents
 */
export async function handleRecipeResource(uri: string, language: Language = DEFAULT_LANGUAGE) {
  // Match recipe details URI: nutrition://recipe/{recipeId}
  const recipeMatch = uri.match(/^nutrition:\/\/recipe\/(\d+)$/);
  if (recipeMatch) {
    const recipeId = parseInt(recipeMatch[1], 10);
    return await handleRecipeDetails(recipeId, language);
  }
  
  // Match recipe ingredients URI: nutrition://recipe/{recipeId}/ingredients
  const ingredientsMatch = uri.match(/^nutrition:\/\/recipe\/(\d+)\/ingredients$/);
  if (ingredientsMatch) {
    const recipeId = parseInt(ingredientsMatch[1], 10);
    return await handleRecipeIngredients(recipeId, language);
  }
  
  // Match recipe nutritional values URI: nutrition://recipe/{recipeId}/nutrition
  const nutritionMatch = uri.match(/^nutrition:\/\/recipe\/(\d+)\/nutrition$/);
  if (nutritionMatch) {
    const recipeId = parseInt(nutritionMatch[1], 10);
    return await handleRecipeNutrition(recipeId, language);
  }
  
  throw new McpError(
    ErrorCode.InvalidRequest,
    `Invalid recipe resource URI: ${uri}`
  );
}

/**
 * Handle recipe details resource
 * @param recipeId The recipe ID
 * @param language The language
 * @returns Recipe details resource
 */
async function handleRecipeDetails(recipeId: number, language: Language) {
  try {
    // Get the recipe details (essentially a food)
    const recipe = await apiClient.getFoodByDBID(recipeId, language);
    
    // Check if it's actually a recipe
    if (!recipe.isrecipe) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Food ID ${recipeId} is not a recipe`
      );
    }
    
    return {
      uri: `nutrition://recipe/${recipeId}`,
      mimeType: 'application/json',
      text: JSON.stringify(recipe, null, 2)
    };
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Error retrieving recipe details: ${error.message}`
      );
    }
    
    throw error;
  }
}

/**
 * Handle recipe ingredients resource
 * @param recipeId The recipe ID
 * @param language The language
 * @returns Recipe ingredients resource
 */
async function handleRecipeIngredients(recipeId: number, language: Language) {
  try {
    const ingredients = await getIngredients({ recipeId, language });
    
    return {
      uri: `nutrition://recipe/${recipeId}/ingredients`,
      mimeType: 'application/json',
      text: JSON.stringify(ingredients, null, 2)
    };
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Error retrieving recipe ingredients: ${error.message}`
      );
    }
    
    throw error;
  }
}

/**
 * Handle recipe nutritional values resource
 * @param recipeId The recipe ID
 * @param language The language
 * @returns Recipe nutritional values resource
 */
async function handleRecipeNutrition(recipeId: number, language: Language) {
  try {
    // First get the ingredients
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
    
    return {
      uri: `nutrition://recipe/${recipeId}/nutrition`,
      mimeType: 'application/json',
      text: JSON.stringify(nutritionResult, null, 2)
    };
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Error calculating recipe nutrition: ${error.message}`
      );
    }
    
    throw error;
  }
}