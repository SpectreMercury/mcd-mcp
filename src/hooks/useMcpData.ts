import { useState, useEffect } from 'react';
import { callMcpTool } from '@/lib/mcp-client';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
    data: T;
    rawData: string;
    timestamp: number;
}

export function useMcpData<T>(toolName: string, args: Record<string, any> = {}, parser?: (text: string) => T) {
    const [data, setData] = useState<T | null>(null);
    const [rawData, setRawData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (forceRefresh = false) => {
        setLoading(true);
        setError(null);

        const cacheKey = `mcp_cache_${toolName}_${JSON.stringify(args)}`;

        try {
            // Check cache
            if (!forceRefresh) {
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    const parsedCache: CacheEntry<T> = JSON.parse(cached);
                    if (Date.now() - parsedCache.timestamp < CACHE_DURATION) {
                        setData(parsedCache.data);
                        setRawData(parsedCache.rawData || '');
                        setLoading(false);
                        return;
                    }
                }
            }

            const result = await callMcpTool(toolName, args);
            if (result && result.content) {
                const text = result.content.map((c: any) => c.text).join('\n');
                const finalData = parser ? parser(text) : (text as unknown as T);

                setData(finalData);
                setRawData(text);

                // Save to cache
                sessionStorage.setItem(cacheKey, JSON.stringify({
                    data: finalData,
                    rawData: text,
                    timestamp: Date.now()
                }));
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [toolName, JSON.stringify(args)]);

    return { data, rawData, loading, error, refresh: () => fetchData(true) };
}
