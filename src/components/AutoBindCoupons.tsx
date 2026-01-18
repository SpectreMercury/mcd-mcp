"use client";

import React, { useState } from 'react';
import { callMcpTool } from '@/lib/mcp-client';
import { Zap, Loader2, CheckCircle2 } from 'lucide-react';

export default function AutoBindCoupons() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleBind = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const resp = await callMcpTool('auto-bind-coupons', {});
            if (resp && resp.content) {
                const text = resp.content.map((c: any) => c.text).join('\n');
                setResult(text);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <button
                onClick={handleBind}
                disabled={loading}
                className="w-full relative overflow-hidden group bg-[#DA291C] text-white rounded-2xl p-4 shadow-lg active:scale-[0.99] transition-all"
            >
                <div className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="font-bold text-lg">正在领取...</span>
                        </>
                    ) : (
                        <>
                            <Zap className="w-5 h-5 fill-current" />
                            <span className="font-bold text-lg">一键领取所有优惠券</span>
                        </>
                    )}
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
            </button>

            {error && (
                <div className="mt-4 text-red-400 text-xs text-center border border-red-900/20 bg-red-900/10 p-2 rounded-lg">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-4 bg-[#FFC72C]/10 border border-[#FFC72C]/20 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 text-[#FFC72C] mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold">领取完成</span>
                    </div>
                    <div
                        className="text-white/80 text-xs leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: result
                                .replace(/\n/g, '<br/>')
                                .replace(/<img/g, '<img class="hidden"') // Hide images in summary
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#FFC72C]">$1</strong>')
                        }}
                    />
                </div>
            )}
        </div>
    );
}
