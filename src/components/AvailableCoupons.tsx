"use client";

import React from 'react';
import { parseAvailableCoupons, Coupon } from '@/lib/parsers';
import { useMcpData } from '@/hooks/useMcpData';
import { Ticket, Loader2 } from 'lucide-react';
import AutoBindCoupons from './AutoBindCoupons';

export default function AvailableCoupons() {
    const { data: coupons, loading, error, refresh } = useMcpData<Coupon[]>('available-coupons', {}, parseAvailableCoupons);

    // Check if all coupons are already claimed
    const allClaimed = coupons && coupons.length > 0 && coupons.every(c => c.status.includes('已') || c.status.includes('claimed'));

    return (
        <div className="w-full space-y-6 pb-20">
            <div className="flex items-center justify-between px-5 pt-2">
                <div className="flex items-center gap-2 text-white">
                    <h3 className="font-bold text-3xl tracking-tight">领券中心</h3>
                </div>
                <button
                    onClick={() => refresh()}
                    disabled={loading}
                    className="text-xs text-white/50 hover:text-[#FFC72C] transition-colors bg-white/5 px-4 py-2 rounded-full backdrop-blur-md"
                >
                    刷新
                </button>
            </div>

            {/* Integrated AutoBind Action - Only show if there are coupons to claim */}
            {!allClaimed && (
                <div className="px-5">
                    <AutoBindCoupons />
                </div>
            )}

            {loading && !coupons && (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#DA291C] animate-spin" />
                </div>
            )}

            {error && (
                <div className="text-red-400 text-sm p-4 bg-red-900/10 rounded-lg border border-red-900/20 mx-5">
                    Error: {error}
                </div>
            )}

            {!loading && !error && coupons && coupons.length === 0 && (
                <div className="flex flex-col items-center justify-center text-white/30 text-sm py-20 mx-5">
                    <Ticket className="w-12 h-12 mb-4 opacity-50" />
                    暂无可用优惠券
                </div>
            )}

            {!loading && !error && coupons && coupons.length > 0 && (
                <div className="grid grid-cols-1 gap-4 px-5">
                    {coupons.map((coupon, idx) => (
                        <div key={idx} className="bg-[#1a1a1a] rounded-2xl p-4 flex gap-4 border border-white/5 shadow-lg active:scale-[0.99] transition-transform">
                            {coupon.image && (
                                <div className="w-24 h-24 bg-white/5 rounded-xl flex-shrink-0 overflow-hidden relative">
                                    <img src={coupon.image} alt={coupon.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h4 className="text-white font-bold text-base leading-tight line-clamp-2">
                                            {coupon.title}
                                        </h4>
                                        <span className={`text-[10px] px-2 py-1 rounded-md font-bold whitespace-nowrap ${coupon.status.includes('已') ? 'bg-white/10 text-white/50' : 'bg-[#FFC72C] text-black'
                                            }`}>
                                            {coupon.status.replace(/状态：/, '')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/40">堂食外送通用</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
