import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { NutritionApiClient } from '../api/client.js';
import { getCategorizedFoods, getFoodDetails, searchFoods } from '../tools/index.js';
import { DEFAULT_LANGUAGE } from '../utils/language.js';
// Create an instance of the API client
const apiClient = new NutritionApiClient();
/**
 * Resource URI templates for food-related resources
 */
export const foodResourceTemplates = [
    {
        uriTemplate: 'nutrition://food/{foodId}',
        name: 'Food details by ID',
        description: 'Get detailed information about a food by its database ID',
        mimeType: 'application/json'
    },
    {
        uriTemplate: 'nutrition://search/{query}',
        name: 'Food search results',
        description: 'Get foods matching a search query',
        mimeType: 'application/json'
    },
    {
        uriTemplate: 'nutrition://category/{categoryId}',
        name: 'Foods in category',
        description: 'Get foods in a specific category',
        mimeType: 'application/json'
    }
];
/**
 * Handle food resource requests
 * @param uri The requested resource URI
 * @param language The language to use for the response
 * @returns The resource contents
 */
export async function handleFoodResource(uri, language = DEFAULT_LANGUAGE) {
    // Match food details URI: nutrition://food/{foodId}
    const foodMatch = uri.match(/^nutrition:\/\/food\/(\d+)$/);
    if (foodMatch) {
        const foodId = parseInt(foodMatch[1], 10);
        return await handleFoodDetails(foodId, language);
    }
    // Match search URI: nutrition://search/{query}
    const searchMatch = uri.match(/^nutrition:\/\/search\/(.+)$/);
    if (searchMatch) {
        const query = decodeURIComponent(searchMatch[1]);
        return await handleFoodSearch(query, language);
    }
    // Match category URI: nutrition://category/{categoryId}
    const categoryMatch = uri.match(/^nutrition:\/\/category\/(\d+)$/);
    if (categoryMatch) {
        const categoryId = parseInt(categoryMatch[1], 10);
        return await handleFoodCategory(categoryId, language);
    }
    throw new McpError(ErrorCode.InvalidRequest, `Invalid food resource URI: ${uri}`);
}
/**
 * Handle food details resource
 * @param foodId The food ID
 * @param language The language
 * @returns Food details resource
 */
async function handleFoodDetails(foodId, language) {
    try {
        const food = await getFoodDetails({ foodId, language });
        return {
            uri: `nutrition://food/${foodId}`,
            mimeType: 'application/json',
            text: JSON.stringify(food, null, 2)
        };
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `Error retrieving food details: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Handle food search resource
 * @param query The search query
 * @param language The language
 * @returns Food search results resource
 */
async function handleFoodSearch(query, language) {
    try {
        const foods = await searchFoods({ query, language });
        return {
            uri: `nutrition://search/${encodeURIComponent(query)}`,
            mimeType: 'application/json',
            text: JSON.stringify(foods, null, 2)
        };
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `Error searching foods: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Handle food category resource
 * @param categoryId The category ID
 * @param language The language
 * @returns Foods in category resource
 */
async function handleFoodCategory(categoryId, language) {
    try {
        const foods = await getCategorizedFoods({ category: categoryId, language });
        return {
            uri: `nutrition://category/${categoryId}`,
            mimeType: 'application/json',
            text: JSON.stringify(foods, null, 2)
        };
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `Error retrieving foods in category: ${error.message}`);
        }
        throw error;
    }
}
//# sourceMappingURL=food.js.map