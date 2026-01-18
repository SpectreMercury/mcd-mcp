import React from 'react';
import { Home, Calendar, Ticket, User } from 'lucide-react';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    const tabs = [
        { id: 'calendar', label: '日历', icon: Calendar },
        { id: 'coupons', label: '领券', icon: Ticket },
        { id: 'mine', label: '我的', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a]/90 backdrop-blur-md border-t border-white/5 px-6 pb-safe-bottom pt-2 z-50">
            <div className="flex justify-between items-end max-w-lg mx-auto">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center gap-1 p-2 transition-all relative ${isActive ? 'text-[#FFC72C]' : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            {isActive && (
                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#FFC72C]/10 rounded-full blur-sm" />
                            )}
                            <tab.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                            <span className="text-[10px] font-medium tracking-wide">
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
