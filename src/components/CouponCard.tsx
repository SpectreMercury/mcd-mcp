import React from 'react';
import { Clock } from 'lucide-react';
import Image from 'next/image';

interface CouponProps {
    title: string;
    price: string;
    originalPrice: string;
    imageSrc: string;
    expiresIn: string;
    description?: string;
}

export default function CouponCard({ title, price, originalPrice, imageSrc, expiresIn, description }: CouponProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col active:scale-95 transition-transform duration-200">
            <div className="relative h-40 w-full bg-gray-50">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-mcd-red flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3" />
                    {expiresIn}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-mcd-black leading-tight mb-1">{title}</h3>
                {description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{description}</p>}

                <div className="mt-auto flex items-end justify-between">
                    <div className='flex flex-col'>
                        <span className="text-xs text-gray-400 line-through font-medium">{originalPrice}</span>
                        <span className="text-2xl font-black text-mcd-red">{price}</span>
                    </div>

                    <button className="bg-mcd-yellow text-mcd-black font-bold px-4 py-2 rounded-xl text-sm shadow-md active:bg-yellow-500 transition-colors">
                        Use Now
                    </button>
                </div>
            </div>
        </div>
    );
}
