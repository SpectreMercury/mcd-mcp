"use client";

import React, { useState } from 'react';

const categories = [
    "All",
    "For You",
    "Burgers",
    "Breakfast",
    "Drinks",
    "Desserts",
    "Chicken",
    "Deals"
];

export default function CategoryFilter() {
    const [active, setActive] = useState("All");

    return (
        <div className="sticky top-[68px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 pb-2">
            <div className="flex overflow-x-auto gap-3 px-4 py-2 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        className={`
              whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all duration-200
              ${active === cat
                                ? "bg-mcd-black text-mcd-yellow shadow-md transform scale-105"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }
            `}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
