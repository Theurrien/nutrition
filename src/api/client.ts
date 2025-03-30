import axios, { AxiosInstance } from 'axios';
import {
  Category,
  CategoryWithNumberOfFoodDTO,
  Component,
  ComponentGroup,
  ComponentSet,
  Food,
  FoodWithNamesSynonymesCategories,
  GetFoodValuesParams,
  GetIngredientsParams,
  Ingredient,
  Language,
  LangualDTO,
  SearchFoodsParams,
  SourceValueDTO,
  TopCategory,
  Unit,
  Value,
  ValueFormatted,
  Versiondb,
} from './types.js';

/**
 * Client for interacting with the Swiss Nutrition Database API
 */
export class NutritionApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.webapp.prod.blv.foodcase-services.com/BLV_WebApp_WS/webresources/BLV-api',
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Handle API errors consistently
   */
  private handleApiError(error: any): never {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      throw new Error(`Swiss Nutrition API error (${status}): ${message}`);
    }
    throw error;
  }

  /**
   * Get all components used in the system
   */
  async getComponents(lang: Language = 'en'): Promise<Component[]> {
    try {
      const response = await this.axiosInstance.get('/components', {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get all units used in the system
   */
  async getUnits(lang: Language = 'en'): Promise<Unit[]> {
    try {
      const response = await this.axiosInstance.get('/units', {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get all component sets used in the system
   */
  async getSets(lang: Language = 'en'): Promise<ComponentSet[]> {
    try {
      const response = await this.axiosInstance.get('/sets', {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get all groups used in the system
   */
  async getGroups(lang: Language = 'en'): Promise<ComponentGroup[]> {
    try {
      const response = await this.axiosInstance.get('/groups', {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get version of the database
   */
  async getDatabaseVersion(): Promise<Versiondb> {
    try {
      const response = await this.axiosInstance.get('/versiondb');
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get all values from the given food
   */
  async getFoodValues(params: GetFoodValuesParams): Promise<Value[]> {
    try {
      const response = await this.axiosInstance.get('/values', {
        params: {
          DBID: params.DBID,
          componentsetid: params.componentsetid,
          lang: params.lang || 'en',
        },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get all categories used in the system
   */
  async getCategories(lang: Language = 'en'): Promise<Category[]> {
    try {
      const response = await this.axiosInstance.get('/categories', {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get all langual codes associated with a particular food
   */
  async getLangualCodes(DBID: number): Promise<LangualDTO[]> {
    try {
      const response = await this.axiosInstance.get('/langualcodes', {
        params: { DBID },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get top level categories
   */
  async getTopCategories(lang: Language = 'en'): Promise<TopCategory[]> {
    try {
      const response = await this.axiosInstance.get('/topcategories', {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Search for foods based on various criteria
   */
  async searchFoods(params: SearchFoodsParams): Promise<FoodWithNamesSynonymesCategories[]> {
    try {
      const response = await this.axiosInstance.get('/foods', {
        params: {
          search: params.search,
          type: params.type,
          category: params.category,
          subcategory: params.subcategory,
          component: params.component,
          operator: params.operator,
          amount: params.amount,
          lang: params.lang || 'en',
          limit: params.limit || 20,
          offset: params.offset || 0,
        },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get all subcategories of a particular top level category
   */
  async getSubcategories(id: number, lang: Language = 'en'): Promise<Category[]> {
    try {
      const response = await this.axiosInstance.get(`/subcategories/${id}`, {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get DBID of the food using foodId
   */
  async getFoodDBID(foodId: number): Promise<number> {
    try {
      const response = await this.axiosInstance.get(`/fooddbid/${foodId}`);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get all foods gathered by category and counted matching search criteria
   */
  async getCategorizedFoods(
    params: SearchFoodsParams
  ): Promise<CategoryWithNumberOfFoodDTO[]> {
    try {
      const response = await this.axiosInstance.get('/categorizedfoods', {
        params: {
          search: params.search,
          type: params.type,
          category: params.category,
          subcategory: params.subcategory,
          component: params.component,
          operator: params.operator,
          amount: params.amount,
          lang: params.lang || 'en',
          limit: params.limit || 20,
          offset: params.offset || 0,
        },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get particular food by DBID
   */
  async getFoodByDBID(DBID: number, lang: Language = 'en'): Promise<Food> {
    try {
      const response = await this.axiosInstance.get(`/food/${DBID}`, {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get all ingredients of a particular food
   */
  async getIngredients(params: GetIngredientsParams): Promise<Ingredient[]> {
    try {
      const response = await this.axiosInstance.get('/ingredients', {
        params: {
          DBID: params.DBID,
          lang: params.lang || 'en',
        },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get source value of particular food component
   */
  async getSourceValue(DBID: number): Promise<SourceValueDTO> {
    try {
      const response = await this.axiosInstance.get(`/source/${DBID}`);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get particular value indicated by DBID
   */
  async getValue(DBID: number, lang: Language = 'en'): Promise<ValueFormatted> {
    try {
      const response = await this.axiosInstance.get(`/value/${DBID}`, {
        params: { lang },
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Reload the cache (admin functionality)
   */
  async reloadCache(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get('/reloadCache');
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get amount of generic foods
   */
  async getGenericCount(): Promise<number[]> {
    try {
      const response = await this.axiosInstance.get('/genericCount');
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }
}