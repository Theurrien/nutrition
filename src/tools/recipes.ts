import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { NutritionApiClient } from '../api/client.js';
import { 
  CalculateRecipeNutritionParams, 
  Component, 
  GetIngredientsParams, 
  Ingredient, 
  Language, 
  Value 
} from '../api/types.js';
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
export async function getIngredients(params: {
  recipeId: number;
  language?: Language;
}): Promise<Ingredient[]> {
  const { recipeId, language = DEFAULT_LANGUAGE } = params;
  
  try {
    // First get the DBID from the recipe ID if they're different
    let dbid = recipeId;
    try {
      dbid = await apiClient.getFoodDBID(recipeId);
    } catch {
      // If getFoodDBID fails, use the original recipeId as the DBID
      dbid = recipeId;
    }
    
    const ingredientsParams: GetIngredientsParams = {
      DBID: dbid,
      lang: language
    };
    
    const ingredients = await apiClient.getIngredients(ingredientsParams);
    
    if (!ingredients || ingredients.length === 0) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `No ingredients found for recipe ID ${recipeId}`
      );
    }
    
    return ingredients;
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new McpError(
        ErrorCode.InternalError,
        `${translate('error.api', language)}: ${error.message}`
      );
    }
    
    throw error;
  }
}

/**
 * Calculate nutritional totals for a custom recipe
 * @param params Parameters for calculating recipe nutrition
 * @returns Combined nutritional values for the recipe
 */
export async function calculateRecipeNutrition(params: CalculateRecipeNutritionParams): Promise<{
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
}> {
  const { ingredients, language = DEFAULT_LANGUAGE } = params;
  
  if (!ingredients || ingredients.length === 0) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'At least one ingredient is required for recipe analysis'
    );
  }
  
  try {
    // Get component sets to find the primary set (usually macronutrients)
    const componentSets = await apiClient.getSets(language);
    if (!componentSets || componentSets.length === 0) {
      throw new McpError(
        ErrorCode.InternalError,
        'Failed to retrieve component sets'
      );
    }
    
    // Use the first component set by default (typically represents main nutrients)
    const componentSetId = componentSets[0].id;
    
    // Get nutritional values for each ingredient
    const ingredientDetails = await Promise.all(
      ingredients.map(async (ingredient) => {
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
        } catch (error) {
          if (error instanceof Error) {
            throw new McpError(
              ErrorCode.InternalError,
              `Error processing ingredient ${ingredient.foodId}: ${error.message}`
            );
          }
          throw error;
        }
      })
    );
    
    // Calculate combined nutritional values
    const componentsMap = new Map<string, {
      component: Component;
      value: number;
      unit: string;
    }>();
    
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
          const existingValue = componentsMap.get(componentName)!;
          existingValue.value += contribution;
        } else {
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
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new McpError(
        ErrorCode.InternalError,
        `${translate('error.api', language)}: ${error.message}`
      );
    }
    
    throw error;
  }
}