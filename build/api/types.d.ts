export type Language = 'en' | 'de' | 'fr' | 'it';
export interface Component {
    name: string;
    id: number;
    code: string;
    group: number;
    unit: number;
    sortorder?: number;
    componentsets?: number[];
}
export interface ComponentWithSets {
    name: string;
    id: number;
    code: string;
    group: number;
    unit: number;
    sets: ComponentSet[];
}
export interface ComponentSet {
    name: string;
    id: number;
    code?: string;
}
export interface ComponentGroup {
    name: string;
    id: number;
    parentComponentGroup?: number;
    componentgroupidcomponent?: number;
    sort?: number;
    getChildComponentGroup?: ComponentGroup[];
}
export interface Unit {
    name: string;
    id: number;
    code: string;
}
export interface Reference {
    id: number;
    citation: string;
    title?: string;
    authors?: string;
    typeDescriptor?: string;
}
export interface Value {
    id: number;
    value: number | string;
    rawValue?: number;
    references?: Reference[];
    component: Component;
    unit: string | Unit;
    minimum?: number | string;
    maximum?: number | string;
    n?: number;
    contrMethodTypes?: string;
    valueTypeCode?: string;
    contributingvalues?: string;
    contributingvaluetypes?: string;
    methodIndicatorCode?: string;
    containformula?: boolean;
    isborrowed?: boolean;
    isrescaled?: boolean;
    isfixed?: boolean;
    methodtypecode?: string;
    derivationOfValue?: string;
    sourceInfoLevel?: number;
}
export interface ValueFormatted {
    id: number;
    value: string;
    references: Reference[];
    component: Component;
    unit: string;
    minimum: string;
    maximum: string;
    n: number;
    derivationOfValue: string;
    sourceInfoLevel: number;
}
export interface SourceValueDTO {
    acquistionTypeDescriptor: string;
    methodIndicatorDescriptor: string;
    references: Reference[];
    updated: string;
    minimum: number;
    maximum: number;
    n: number;
    methodindicatorcode: string;
    valuetypecode: string;
    contributingvalues: string;
    contributingvaluetypes: string;
    methodtypecode: string;
    containformula: boolean;
    isborrowed: boolean;
    isrescaled: boolean;
    isfixed: boolean;
    contrMethodTypes: string;
}
export interface FoodName {
    name: string;
    id: number;
    issearchable?: boolean;
}
export interface Name {
    id: number;
    term: string;
}
export interface Synonym {
    id: number;
    term: string;
    type: string;
}
export interface Category {
    name: string;
    id: number;
}
export interface Food {
    name: string;
    id: number;
    ncf?: number;
    facf?: number;
    isgeneric: boolean;
    isrecipe: boolean;
    synonyms?: Synonym[];
    categories?: Category[];
    values?: Value[];
    matrixunitcode?: string;
    specificgravity?: number;
    yieldfactor?: number;
    foodid?: number;
}
export interface FoodWithNamesSynonymesCategories {
    id: number;
    generic: boolean;
    names: Name[];
    synonyms: Synonym[];
    categories: number[];
}
export interface Ingredient {
    foodid: FoodName;
    amount: number;
    percent?: number;
    unit: string;
    isrecipe: boolean;
    dummyprepmethods?: string;
}
export interface TopCategory {
    letter: string;
    description: string;
    classification: string;
}
export interface CategoryWithNumberOfFoodDTO {
    categoryId: number;
    categoryName: string;
    numberOfFoods: number;
}
export interface LangualDTO {
    letter: string;
    description: string;
    classification: string;
}
export interface Versiondb {
    idversion: number;
    versiontext: string;
}
export interface SearchFoodsParams {
    search?: string;
    type?: boolean;
    category?: number;
    subcategory?: number[];
    component?: number;
    operator?: '<' | '>' | '=';
    amount?: number;
    lang?: Language;
    limit?: number;
    offset?: number;
}
export interface GetFoodValuesParams {
    DBID: number;
    componentsetid: number;
    lang?: Language;
}
export interface GetIngredientsParams {
    DBID: number;
    lang?: Language;
}
export interface CalculateRecipeNutritionParams {
    ingredients: Array<{
        foodId: number;
        amount: number;
        unit: string;
    }>;
    language?: Language;
}
