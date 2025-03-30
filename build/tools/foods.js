import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { NutritionApiClient } from '../api/client.js';
import { translate } from '../utils/i18n.js';
import { DEFAULT_LANGUAGE } from '../utils/language.js';
// Create an instance of the API client
const apiClient = new NutritionApiClient();
/**
 * Search for foods in the Swiss Nutrition Database
 * @param params Search parameters
 * @returns Array of matching foods
 */
export async function searchFoods(params) {
    const { query, language = DEFAULT_LANGUAGE, foodType, category, limit } = params;
    try {
        const searchParams = {
            search: query,
            type: foodType,
            category,
            lang: language,
            limit
        };
        const foods = await apiClient.searchFoods(searchParams);
        if (foods.length === 0) {
            // No results found, but not an error
            return [];
        }
        return foods;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `${translate('error.api', language)}: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Get detailed information about a specific food
 * @param params Parameters with food ID and language
 * @returns Detailed food information
 */
export async function getFoodDetails(params) {
    const { foodId, language = DEFAULT_LANGUAGE } = params;
    try {
        // First get the DBID from the food ID if they're different
        let dbid = foodId;
        try {
            dbid = await apiClient.getFoodDBID(foodId);
        }
        catch {
            // If getFoodDBID fails, use the original foodId as the DBID
            dbid = foodId;
        }
        // Get the food details
        const food = await apiClient.getFoodByDBID(dbid, language);
        if (!food) {
            throw new McpError(ErrorCode.InvalidRequest, translate('error.notFound', language));
        }
        return food;
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
 * Get categories with food counts that match search criteria
 * @param params Search parameters
 * @returns Array of categories with food counts
 */
export async function getCategorizedFoods(params) {
    const { query, language = DEFAULT_LANGUAGE, foodType, category, limit } = params;
    try {
        const searchParams = {
            search: query,
            type: foodType,
            category,
            lang: language,
            limit
        };
        const categorizedFoods = await apiClient.getCategorizedFoods(searchParams);
        return categorizedFoods;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `${translate('error.api', language)}: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Get the top-level food categories
 * @param language Language code
 * @returns Array of top-level categories
 */
export async function getTopCategories(language = DEFAULT_LANGUAGE) {
    try {
        return await apiClient.getTopCategories(language);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `${translate('error.api', language)}: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Get subcategories for a top-level category
 * @param params Parameters with category ID and language
 * @returns Array of subcategories
 */
export async function getSubcategories(params) {
    const { categoryId, language = DEFAULT_LANGUAGE } = params;
    try {
        return await apiClient.getSubcategories(categoryId, language);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `${translate('error.api', language)}: ${error.message}`);
        }
        throw error;
    }
}
//# sourceMappingURL=foods.js.map