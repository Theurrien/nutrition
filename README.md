# Swiss Nutrition Database MCP Server

An MCP server for accessing the Swiss Food Composition Database API from Claude Desktop App.

## Features

- **Multi-language Support**: Access food information in English, German, French, and Italian
- **Food Search**: Search for foods by name, category, or nutritional criteria
- **Recipe Search**: Find recipes in the database by name or ingredients
- **Nutritional Information**: Get detailed nutritional values for any food in the database
- **Food Comparison**: Compare nutritional values between different foods
- **Recipe Analysis**: Calculate nutritional totals for recipes based on ingredients
- **Language Preferences**: Set your preferred language for responses

## Installation

The MCP server has been configured and installed for your Claude Desktop App. You can access it immediately by restarting the app.

## Usage Examples

Here are some examples of how to use the Swiss Nutrition Database MCP server with Claude:

### Searching for Foods

"Search for apple in the Swiss Nutrition Database"

This will use the `search_foods` tool to find foods matching "apple" in the database.

### Searching for Recipes

"Find bread recipes in the Swiss Nutrition Database"

This will use the `search_recipes` tool to search specifically for recipes containing the term "bread".

### Getting Food Details

"What's the nutritional information for chocolate in the Swiss database?"

This will first search for chocolate and then use the `get_food_details` tool to retrieve detailed information.

### Comparing Foods

"Compare the nutritional values of milk and almond milk from the Swiss database"

This will use the `compare_nutritional_values` tool to show a side-by-side comparison.

### Recipe Analysis

"Calculate the nutritional content of a recipe with 100g of chicken, 50g of rice, and 30g of butter"

This will use the `calculate_recipe_nutrition` tool to determine the combined nutritional values for a custom recipe.

### Recipe Nutrition Lookup

"Get the nutritional information for lasagna recipe ID 12345"

This will use the `get_recipe_nutrition` tool to retrieve the complete nutritional breakdown for an existing recipe in the database.

### Changing Language

"Switch to German for Swiss nutrition data"

This will use the `set_language_preference` tool to change the language of responses.

## Available Tools

- `search_foods`: Search for foods in the database
- `search_recipes`: Search specifically for recipes in the database
- `get_food_details`: Get detailed information about a specific food
- `get_nutritional_values`: Get nutritional values for a specific food
- `compare_nutritional_values`: Compare nutritional values between multiple foods
- `get_ingredients`: Get ingredients for a specific recipe
- `calculate_recipe_nutrition`: Calculate nutritional totals for a custom recipe
- `get_recipe_nutrition`: Get complete nutritional information for an existing recipe by ID
- `set_language_preference`: Set the preferred language for results
- `detect_language`: Detect language from text input

## Available Resources

- `nutrition://food/{foodId}`: Get food details by ID
- `nutrition://search/{query}`: Get foods matching a search query
- `nutrition://category/{categoryId}`: Get foods in a category
- `nutrition://recipe/{recipeId}`: Get recipe details by ID
- `nutrition://recipe/{recipeId}/ingredients`: Get recipe ingredients
- `nutrition://recipe/{recipeId}/nutrition`: Get recipe nutritional values

## Data Source

This MCP server uses the official Swiss Food Composition Database API:
https://api.webapp.prod.blv.foodcase-services.com/BLV_WebApp_WS