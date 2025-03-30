import { Category, CategoryWithNumberOfFoodDTO, Component, ComponentGroup, ComponentSet, Food, FoodWithNamesSynonymesCategories, GetFoodValuesParams, GetIngredientsParams, Ingredient, Language, LangualDTO, SearchFoodsParams, SourceValueDTO, TopCategory, Unit, Value, ValueFormatted, Versiondb } from './types.js';
/**
 * Client for interacting with the Swiss Nutrition Database API
 */
export declare class NutritionApiClient {
    private axiosInstance;
    constructor();
    /**
     * Handle API errors consistently
     */
    private handleApiError;
    /**
     * Get all components used in the system
     */
    getComponents(lang?: Language): Promise<Component[]>;
    /**
     * Get all units used in the system
     */
    getUnits(lang?: Language): Promise<Unit[]>;
    /**
     * Get all component sets used in the system
     */
    getSets(lang?: Language): Promise<ComponentSet[]>;
    /**
     * Get all groups used in the system
     */
    getGroups(lang?: Language): Promise<ComponentGroup[]>;
    /**
     * Get version of the database
     */
    getDatabaseVersion(): Promise<Versiondb>;
    /**
     * Get all values from the given food
     */
    getFoodValues(params: GetFoodValuesParams): Promise<Value[]>;
    /**
     * Get all categories used in the system
     */
    getCategories(lang?: Language): Promise<Category[]>;
    /**
     * Get all langual codes associated with a particular food
     */
    getLangualCodes(DBID: number): Promise<LangualDTO[]>;
    /**
     * Get top level categories
     */
    getTopCategories(lang?: Language): Promise<TopCategory[]>;
    /**
     * Search for foods based on various criteria
     */
    searchFoods(params: SearchFoodsParams): Promise<FoodWithNamesSynonymesCategories[]>;
    /**
     * Get all subcategories of a particular top level category
     */
    getSubcategories(id: number, lang?: Language): Promise<Category[]>;
    /**
     * Get DBID of the food using foodId
     */
    getFoodDBID(foodId: number): Promise<number>;
    /**
     * Get all foods gathered by category and counted matching search criteria
     */
    getCategorizedFoods(params: SearchFoodsParams): Promise<CategoryWithNumberOfFoodDTO[]>;
    /**
     * Get particular food by DBID
     */
    getFoodByDBID(DBID: number, lang?: Language): Promise<Food>;
    /**
     * Get all ingredients of a particular food
     */
    getIngredients(params: GetIngredientsParams): Promise<Ingredient[]>;
    /**
     * Get source value of particular food component
     */
    getSourceValue(DBID: number): Promise<SourceValueDTO>;
    /**
     * Get particular value indicated by DBID
     */
    getValue(DBID: number, lang?: Language): Promise<ValueFormatted>;
    /**
     * Reload the cache (admin functionality)
     */
    reloadCache(): Promise<boolean>;
    /**
     * Get amount of generic foods
     */
    getGenericCount(): Promise<number[]>;
}
