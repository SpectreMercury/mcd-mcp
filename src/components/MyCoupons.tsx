"use client";

import React from 'react';
import { parseMyCoupons, Coupon } from '@/lib/parsers';
import { useMcpData } from '@/hooks/useMcpData';
import { ShoppingBag, Loader2, Calendar, X } from 'lucide-react';

export default function MyCoupons() {
    const { data: coupons, loading, error, refresh } = useMcpData<Coupon[]>('my-coupons', {}, parseMyCoupons);
    const [selectedCoupon, setSelectedCoupon] = React.useState<Coupon | null>(null);

    return (
        <>
            <div className="w-full space-y-4 pb-20"> {/* Bottom padding for nav */}
                <div className="flex items-center justify-between px-5">
                    <h3 className="font-bold text-2xl text-white">我的卡券</h3>
                    <button
                        onClick={() => refresh()}
                        disabled={loading}
                        className="text-white/50 hover:text-[#FFC72C] transition-colors flex items-center gap-1 text-xs"
                    >
                        {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                        刷新
                    </button>
                </div>

                {loading && !coupons && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="text-red-400 text-sm p-4 bg-red-900/10 rounded-lg border border-red-900/20 mx-5">
                        Error: {error}
                    </div>
                )}

                {!loading && !error && coupons && coupons.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-white/30 text-sm py-20 bg-[#1a1a1a]/50 rounded-2xl border border-white/5 mx-5">
                        <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
                        暂无卡券
                    </div>
                )}

                {!loading && !error && coupons && coupons.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5">
                        {coupons.map((coupon, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedCoupon(coupon)}
                                className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden flex flex-col shadow-lg cursor-pointer active:scale-[0.98] transition-all hover:border-white/10"
                            >
                                {coupon.image && (
                                    <div className="relative w-full aspect-[2/1] bg-white/5">
                                        <img src={coupon.image} alt={coupon.title} className="w-full h-full object-cover" />
                                        {coupon.price && (
                                            <div className="absolute top-2 right-2 bg-[#FFC72C] text-black font-bold px-3 py-1 rounded-full text-sm shadow-md">
                                                {coupon.price}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="p-4">
                                    <h4 className="text-white font-bold text-lg mb-2 line-clamp-2">{coupon.title}</h4>
                                    {coupon.validity && (
                                        <div className="flex items-center gap-2 text-xs text-white/50 bg-white/5 p-2 rounded-lg mb-2">
                                            <Calendar className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">{coupon.validity}</span>
                                        </div>
                                    )}
                                    <div className="flex gap-2 flex-wrap">
                                        {coupon.tags && coupon.tags.map((tag, i) => (
                                            <span key={i} className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded border border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Full Screen Coupon Detail Modal */}
            {selectedCoupon && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-10 duration-300">
                        <button
                            onClick={() => setSelectedCoupon(null)}
                            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-black" />
                        </button>

                        <div className="p-8 flex flex-col items-center pt-12">
                            <h3 className="text-xl font-black text-center text-gray-900 mb-2 leading-tight">
                                {selectedCoupon.title}
                            </h3>
                            {selectedCoupon.price && (
                                <div className="text-[#DA291C] font-bold text-lg mb-6">
                                    优惠价 {selectedCoupon.price}
                                </div>
                            )}

                            {/* QR Code / Image Area */}
                            <div className="w-64 h-64 bg-gray-100 rounded-xl mb-6 p-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                                {selectedCoupon.image ? (
                                    <img src={selectedCoupon.image} className="w-full h-full object-contain mix-blend-multiply" alt="Code" />
                                ) : (
                                    <div className="text-center text-gray-400 text-xs">暂无二维码</div>
                                )}
                            </div>

                            <p className="text-xs text-gray-400 mb-8 text-center">
                                请向店员出示此二维码核销
                            </p>

                            <div className="w-full space-y-3 bg-gray-50 p-4 rounded-xl">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">有效期</span>
                                    <span className="font-bold text-gray-800">{selectedCoupon.validity?.split(' ')[0] || '详见详情'}</span>
                                </div>
                                {selectedCoupon.tags && selectedCoupon.tags.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {selectedCoupon.tags.map((tag, i) => (
                                            <span key={i} className="text-[10px] text-[#DA291C] bg-[#DA291C]/10 px-2 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
