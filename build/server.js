import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ErrorCode, ListResourcesRequestSchema, ListResourceTemplatesRequestSchema, ListToolsRequestSchema, McpError, ReadResourceRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { foodResourceTemplates, handleFoodResource } from './resources/food.js';
import { handleRecipeResource, recipeResourceTemplates } from './resources/recipe.js';
import { compareNutritionalValues, calculateRecipeNutrition, getFoodDetails, getNutritionalValues, getIngredients, searchFoods, } from './tools/index.js';
import { translate } from './utils/i18n.js';
import { DEFAULT_LANGUAGE, detectLanguage, setUserLanguagePreference } from './utils/language.js';
/**
 * Swiss Nutrition Database MCP Server
 */
export class NutritionMcpServer {
    constructor() {
        this.server = new Server({
            name: 'swiss-nutrition-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                resources: {},
                tools: {},
            },
        });
        this.setupToolHandlers();
        this.setupResourceHandlers();
        // Error handling
        this.server.onerror = (error) => console.error('[MCP Error]', error);
    }
    /**
     * Set up tool handlers for the MCP server
     */
    setupToolHandlers() {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'search_foods',
                    description: translate('tool.searchFoods.description', DEFAULT_LANGUAGE),
                    inputSchema: {
                        type: 'object',
                        properties: {
                            query: { type: 'string', description: 'Search term' },
                            language: {
                                type: 'string',
                                enum: ['en', 'de', 'fr', 'it'],
                                default: 'en',
                                description: 'Language for results'
                            },
                            foodType: {
                                type: 'boolean',
                                description: 'True for generic foods, false for branded foods'
                            },
                            category: {
                                type: 'number',
                                description: 'Top level category ID'
                            },
                            limit: {
                                type: 'number',
                                description: 'Maximum number of results'
                            }
                        },
                        required: ['query']
                    }
                },
                {
                    name: 'get_food_details',
                    description: translate('tool.getFoodDetails.description', DEFAULT_LANGUAGE),
                    inputSchema: {
                        type: 'object',
                        properties: {
                            foodId: {
                                type: 'number',
                                description: 'Database ID of the food'
                            },
                            language: {
                                type: 'string',
                                enum: ['en', 'de', 'fr', 'it'],
                                default: 'en',
                                description: 'Language for results'
                            }
                        },
                        required: ['foodId']
                    }
                },
                {
                    name: 'get_nutritional_values',
                    description: 'Get nutritional values for a specific food',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            foodId: {
                                type: 'number',
                                description: 'Database ID of the food'
                            },
                            componentSetId: {
                                type: 'number',
                                description: 'Component set ID'
                            },
                            language: {
                                type: 'string',
                                enum: ['en', 'de', 'fr', 'it'],
                                default: 'en',
                                description: 'Language for results'
                            }
                        },
                        required: ['foodId', 'componentSetId']
                    }
                },
                {
                    name: 'compare_nutritional_values',
                    description: 'Compare nutritional values between multiple foods',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            foodIds: {
                                type: 'array',
                                items: { type: 'number' },
                                description: 'Array of food database IDs to compare'
                            },
                            componentSetId: {
                                type: 'number',
                                description: 'Component set ID'
                            },
                            language: {
                                type: 'string',
                                enum: ['en', 'de', 'fr', 'it'],
                                default: 'en',
                                description: 'Language for results'
                            }
                        },
                        required: ['foodIds', 'componentSetId']
                    }
                },
                {
                    name: 'get_ingredients',
                    description: 'Get ingredients for a specific recipe',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            recipeId: {
                                type: 'number',
                                description: 'Database ID of the recipe'
                            },
                            language: {
                                type: 'string',
                                enum: ['en', 'de', 'fr', 'it'],
                                default: 'en',
                                description: 'Language for results'
                            }
                        },
                        required: ['recipeId']
                    }
                },
                {
                    name: 'calculate_recipe_nutrition',
                    description: translate('tool.calculateRecipeNutrition.description', DEFAULT_LANGUAGE),
                    inputSchema: {
                        type: 'object',
                        properties: {
                            ingredients: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        foodId: {
                                            type: 'number',
                                            description: 'Database ID of the ingredient'
                                        },
                                        amount: {
                                            type: 'number',
                                            description: 'Amount of the ingredient'
                                        },
                                        unit: {
                                            type: 'string',
                                            description: 'Unit of measurement'
                                        }
                                    },
                                    required: ['foodId', 'amount', 'unit']
                                },
                                description: 'List of ingredients with amounts'
                            },
                            language: {
                                type: 'string',
                                enum: ['en', 'de', 'fr', 'it'],
                                default: 'en',
                                description: 'Language for results'
                            }
                        },
                        required: ['ingredients']
                    }
                },
                {
                    name: 'set_language_preference',
                    description: 'Set the preferred language for results',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            userId: {
                                type: 'string',
                                description: 'User identifier'
                            },
                            language: {
                                type: 'string',
                                enum: ['en', 'de', 'fr', 'it'],
                                description: 'Preferred language'
                            }
                        },
                        required: ['userId', 'language']
                    }
                },
                {
                    name: 'detect_language',
                    description: 'Detect language from text input',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            text: {
                                type: 'string',
                                description: 'Text to analyze for language detection'
                            }
                        },
                        required: ['text']
                    }
                }
            ],
        }));
        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            try {
                switch (request.params.name) {
                    case 'search_foods': {
                        const result = await searchFoods(request.params.arguments);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(result, null, 2),
                                },
                            ],
                        };
                    }
                    case 'get_food_details': {
                        const result = await getFoodDetails(request.params.arguments);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(result, null, 2),
                                },
                            ],
                        };
                    }
                    case 'get_nutritional_values': {
                        const result = await getNutritionalValues(request.params.arguments);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(result, null, 2),
                                },
                            ],
                        };
                    }
                    case 'compare_nutritional_values': {
                        const result = await compareNutritionalValues(request.params.arguments);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(result, null, 2),
                                },
                            ],
                        };
                    }
                    case 'get_ingredients': {
                        const result = await getIngredients(request.params.arguments);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(result, null, 2),
                                },
                            ],
                        };
                    }
                    case 'calculate_recipe_nutrition': {
                        const result = await calculateRecipeNutrition(request.params.arguments);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(result, null, 2),
                                },
                            ],
                        };
                    }
                    case 'set_language_preference': {
                        const { userId, language } = request.params.arguments;
                        if (!userId || !language) {
                            throw new McpError(ErrorCode.InvalidParams, 'userId and language are required');
                        }
                        setUserLanguagePreference(userId, language);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `Language preference set to ${language} for user ${userId}`,
                                },
                            ],
                        };
                    }
                    case 'detect_language': {
                        const { text } = request.params.arguments;
                        if (!text) {
                            throw new McpError(ErrorCode.InvalidParams, 'text is required');
                        }
                        const detectedLanguage = detectLanguage(text);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({ detectedLanguage }, null, 2),
                                },
                            ],
                        };
                    }
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
                }
            }
            catch (error) {
                console.error(`Error executing tool ${request.params.name}:`, error);
                if (error instanceof McpError) {
                    throw error;
                }
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error executing tool ${request.params.name}: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }
    /**
     * Set up resource handlers for the MCP server
     */
    setupResourceHandlers() {
        // List available resources
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
            resources: [
            // Static resources could be added here
            ],
        }));
        // List available resource templates
        this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
            resourceTemplates: [
                ...foodResourceTemplates,
                ...recipeResourceTemplates,
            ],
        }));
        // Handle resource requests
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            try {
                const { uri } = request.params;
                // Use default values since context is not available
                const userId = 'default';
                const language = DEFAULT_LANGUAGE;
                // Handle food resources
                if (uri.startsWith('nutrition://food/') ||
                    uri.startsWith('nutrition://search/') ||
                    uri.startsWith('nutrition://category/')) {
                    const resource = await handleFoodResource(uri, language);
                    return {
                        contents: [resource],
                    };
                }
                // Handle recipe resources
                if (uri.startsWith('nutrition://recipe/')) {
                    const resource = await handleRecipeResource(uri, language);
                    return {
                        contents: [resource],
                    };
                }
                throw new McpError(ErrorCode.InvalidRequest, `Invalid resource URI: ${uri}`);
            }
            catch (error) {
                console.error(`Error reading resource ${request.params.uri}:`, error);
                if (error instanceof McpError) {
                    throw error;
                }
                throw new McpError(ErrorCode.InternalError, `Error reading resource: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    /**
     * Connect to a transport and start the server
     * @param transport The transport to connect to
     */
    async connect(transport) {
        await this.server.connect(transport);
    }
    /**
     * Close the server connection
     */
    async close() {
        await this.server.close();
    }
}
//# sourceMappingURL=server.js.map