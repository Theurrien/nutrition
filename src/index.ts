#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { NutritionMcpServer } from './server.js';

/**
 * Main entry point for the Swiss Nutrition Database MCP server
 */
async function main() {
  console.error('Starting Swiss Nutrition Database MCP server...');
  
  try {
    // Create server instance
    const server = new NutritionMcpServer();
    
    // Create Stdio transport
    const transport = new StdioServerTransport();
    
    // Connect server to transport
    await server.connect(transport);
    
    console.error('Swiss Nutrition Database MCP server running on stdio');
    
    // Handle process termination
    process.on('SIGINT', async () => {
      console.error('Shutting down...');
      await server.close();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.error('Shutting down...');
      await server.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});