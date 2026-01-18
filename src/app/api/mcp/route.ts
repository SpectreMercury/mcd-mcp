import { NextRequest, NextResponse } from 'next/server';

const MCD_MCP_ENDPOINT = 'https://mcp.mcd.cn/mcp-servers/mcd-mcp';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const authHeader = req.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
        }

        // Forward the request to the real MCP server
        // We assume the body is a valid JSON-RPC 2.0 request
        const response = await fetch(MCD_MCP_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
                // Add fake user agent to prevent some basic blocks if necessary, but keep it standard for now.
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: `MCP Server Error: ${response.status}`, details: errorText }, { status: response.status });
        }

        // Attempt to handle streamed responses? 
        // The docs say "Streamable HTTP", which often might mean Server-Sent Events (SSE) or simple JSON-RPC.
        // However, given the "tools" nature, usually it's a simple POST->Response for tool calls.
        // If it is JSON-RPC, we just return the JSON.
        const data = await response.json();

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
