
export interface McpToolResponse {
    jsonrpc: "2.0";
    id: number | string;
    result?: {
        content: Array<{
            type: string;
            text?: string;
            resource?: any;
        }>;
        isError?: boolean;
    };
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}

export async function callMcpTool(toolName: string, args: Record<string, any> = {}): Promise<any> {
    const apiKey = localStorage.getItem('mcd_api_key');
    if (!apiKey) {
        throw new Error("No API Key configured. Please add one in settings.");
    }

    // Construct JSON-RPC 2.0 Request
    const payload = {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
            name: toolName,
            arguments: args
        },
        id: Date.now()
    };

    const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.details || `Request failed with status ${response.status}`);
    }

    const data: McpToolResponse = await response.json();

    if (data.error) {
        throw new Error(`MCP Error ${data.error.code}: ${data.error.message}`);
    }

    // MCP 'tools/call' usually returns a result with a content list.
    // We typically want the text content for LLMs, but here we likely get structured text 
    // that we might need to parse, OR maybe the tool returns JSON embedded in text.
    // Based on the examples, the tool returns markdown-like text with images.
    // We will return the full result object for the UI to parse.
    return data.result;
}
