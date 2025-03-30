/**
 * Swiss Nutrition Database MCP Server
 */
export declare class NutritionMcpServer {
    private server;
    constructor();
    /**
     * Set up tool handlers for the MCP server
     */
    private setupToolHandlers;
    /**
     * Set up resource handlers for the MCP server
     */
    private setupResourceHandlers;
    /**
     * Connect to a transport and start the server
     * @param transport The transport to connect to
     */
    connect(transport: any): Promise<void>;
    /**
     * Close the server connection
     */
    close(): Promise<void>;
}
