# Swiss Nutrition Database MCP Server - Project Structure Summary

## Project Overview:

*   **Purpose:** Provides tools and resources for accessing the Swiss Food Composition Database via the Model Context Protocol (MCP), making it usable within applications like the Claude Desktop App.
*   **Technology:** Built with Node.js and TypeScript, using the `@modelcontextprotocol/sdk` for MCP server implementation and `axios` for communicating with the external database API.
*   **Entry Point:** The server starts via `node build/index.js`, which executes the compiled code from `src/index.ts`. This script sets up an `StdioServerTransport` and initializes the `NutritionMcpServer`.
*   **Core Logic (`src/server.ts`):** This class defines the server's capabilities, registers tools and resource handlers, and manages the connection.
*   **API Interaction (`src/api/`):** Contains the client logic (`client.ts`) and type definitions (`types.ts`) for interacting with the external Swiss Food Composition Database API (https://api.webapp.prod.blv.foodcase-services.com/BLV_WebApp_WS).
*   **Tools (`src/tools/`):** Implements the server's actions, such as searching foods (`foods.ts`), handling nutritional calculations (`nutrition.ts`), managing recipes (`recipes.ts`), and language utilities. These are exposed via the `CallToolRequestSchema`.
*   **Resources (`src/resources/`):** Defines how data entities (like specific foods or recipes) are represented and accessed via URIs (e.g., `nutrition://food/{id}`). Handlers are registered via `ReadResourceRequestSchema` and `ListResourceTemplatesRequestSchema`.
*   **Utilities (`src/utils/`):** Provides helper functions, notably for internationalization (`i18n.ts`) supporting English, German, French, and Italian, and managing language preferences (`language.ts`).
*   **Build Process:** TypeScript code in `src/` is compiled into JavaScript in the `build/` directory using `tsc` (defined in `package.json` scripts).
*   **Configuration:** `package.json` manages dependencies and scripts; `tsconfig.json` configures the TypeScript compiler.
*   **Documentation:** `README.md` provides a user-facing overview, usage examples, and lists available tools/resources. The PDF files likely contain API specifications.

## Key Capabilities:

*   Searching for foods.
*   Retrieving detailed food information and nutritional values.
*   Comparing nutritional values between foods.
*   Calculating nutrition for recipes.
*   Managing language preferences for results.

## Structure Diagram (Conceptual):

```mermaid
graph TD
    A[Claude Desktop App] -- MCP --> B(Nutrition MCP Server);
    B -- stdio --> C(src/index.ts);
    C --> D(src/server.ts);
    D -- registers --> E{Tools};
    D -- registers --> F{Resources};
    D -- uses --> G(src/utils/);
    E --> H(src/tools/);
    F --> I(src/resources/);
    H -- uses --> J(src/api/client.ts);
    I -- uses --> J;
    J -- HTTP requests --> K[Swiss Food DB API];

    subgraph Server Code (src/)
        C
        D
        G
        H
        I
        J
    end

    subgraph Build Output
        L(build/)
    end

    M(package.json) --> B;
    N(tsconfig.json) --> B;
    O(README.md) --> B;

    style K fill:#f9f,stroke:#333,stroke-width:2px
```

---

## Plan for Recipe Functionality Enhancements

Based on the analysis of the current code and API capabilities, the following enhancements are planned:

### 1. Add `search_recipes` Tool

*   **Goal:** Allow users to search for recipes by name or keyword within the Swiss Food Composition Database.
*   **Implementation:**
    *   Define a new tool named `search_recipes` in `src/server.ts`. It should accept parameters similar to `search_foods` (e.g., `query: string`, `language?: Language`, `limit?: number`).
    *   Create a corresponding function `searchRecipes` (likely in `src/tools/recipes.ts` or `src/tools/foods.ts`).
    *   This function will perform the following steps:
        1.  Call `apiClient.searchFoods` using the provided `query` and other parameters. This endpoint returns a list of `FoodWithNamesSynonymesCategories` objects.
        2.  Iterate through the IDs (`id`) returned in the search results.
        3.  For each `id`, call `apiClient.getFoodByDBID(id, language)` to fetch the full `Food` object details.
        4.  Filter this list of full `Food` objects, keeping only those where the `isrecipe` property is `true`.
        5.  Return the filtered list of recipe objects (e.g., as an array of `Food` objects or potentially simplified `FoodWithNamesSynonymesCategories` if sufficient).
*   **Note:** This approach requires multiple API calls (one search + one detail fetch per result) due to the apparent lack of a direct recipe filter in the search API endpoint. This might impact performance for searches returning many results.

### 2. Add `get_recipe_nutrition` Tool

*   **Goal:** Provide a convenient tool to directly calculate the nutritional information for a known recipe ID from the database, without requiring the user to manually list ingredients.
*   **Implementation:**
    *   Define a new tool named `get_recipe_nutrition` in `src/server.ts`. It should accept parameters `recipeId: number` and `language?: Language`.
    *   Create a corresponding function `getRecipeNutrition` in `src/tools/recipes.ts`.
    *   This function will reuse the logic already implemented in `handleRecipeNutrition` within `src/resources/recipe.ts`:
        1.  Call the existing `getIngredients({ recipeId, language })` function (from `src/tools/recipes.ts`).
        2.  Transform the returned ingredients list into the format expected by `calculateRecipeNutrition` (an array of `{ foodId: number, amount: number, unit: string }`).
        3.  Call the existing `calculateRecipeNutrition` function (from `src/tools/recipes.ts`) with the transformed ingredients and language.
        4.  Return the calculated nutritional result.

### 3. Update Documentation

*   Add the new `search_recipes` and `get_recipe_nutrition` tools, along with usage examples, to the `README.md`.
*   Ensure this plan file (`nutrition-mcp-server-plan.md`) is kept up-to-date.

### Integration Flow

1.  User searches for recipes using the new `search_recipes` tool.
2.  The tool returns a list of recipes (IDs, names, etc.).
3.  The user can then take a specific `recipeId` from the results and use it with:
    *   `get_food_details` (to view the basic recipe information stored in the `Food` object).
    *   `get_ingredients` (to get the list of ingredients for that recipe).
    *   The new `get_recipe_nutrition` tool (to directly get the calculated nutritional breakdown for the recipe).
4.  The existing `calculate_recipe_nutrition` tool remains available for calculating nutrition based on custom ingredient lists provided directly by the user.

### Diagram of Proposed Changes

```mermaid
graph TD
    subgraph "MCP Server (src/server.ts)"
        direction LR
        T1[ListTools]
        T2[CallTool]
        T3[...]
    end

    subgraph "Tools (src/tools/)"
        direction LR
        F1[foods.ts]
        F2[recipes.ts]
        F3[nutrition.ts]
        F4[index.ts]
    end

    subgraph "API Client (src/api/)"
        direction LR
        C1[client.ts]
        C2[types.ts]
    end

    T2 -- calls --> F4 --> F1 & F2 & F3;

    F1 -- uses --> C1;
    F2 -- uses --> C1 & F3;
    F3 -- uses --> C1;

    subgraph "New/Modified Components"
        style New fill:#ccffcc,stroke:#006600
        NewTool1(search_recipes Tool):::New --> NewFunc1(searchRecipes Func):::New;
        NewTool2(get_recipe_nutrition Tool):::New --> NewFunc2(getRecipeNutrition Func):::New;
        NewFunc1 -- uses --> C1[client.ts];
        NewFunc2 -- uses --> F2[recipes.ts/getIngredients];
        NewFunc2 -- uses --> F2[recipes.ts/calculateRecipeNutrition];
    end

    classDef New fill:#ccffcc,stroke:#006600;