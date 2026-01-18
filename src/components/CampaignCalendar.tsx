"use client";

import React, { useState } from 'react';
import { parseCalendarData, CalendarEvent } from '@/lib/parsers';
import { useMcpData } from '@/hooks/useMcpData';
import { Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

// Helper to get days in month for grid
// Note: This is a simplified calendar logic assuming current month or the month returned by API
// Since the API returns specific dates, we might just map them to a grid of the current month.
// unique dates from events to know which month to show? 
// The user prompt shows a grid "May 五月", so likely we need a real calendar generation.

export default function CampaignCalendar() {
    const { data: events, loading, error, refresh } = useMcpData<CalendarEvent[]>('campaign-calender', {}, parseCalendarData);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // Determine displayed month. Simple logic: Use current real month, map events to it.
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    // Generate grid cells
    const gridCells = [];
    // Empty slots for start padding
    for (let i = 0; i < startDay; i++) {
        gridCells.push(null);
    }
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        gridCells.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
    }

    // Map events to dates
    // Event date format "12月8日" (MM-DD approx, missing year usually, assume current year/closest)
    const getEventForDate = (date: Date) => {
        if (!events) return null;
        return events.find(e => {
            // Parse e.date "12月8日"
            const match = e.date.match(/(\d+)月(\d+)日/);
            if (match) {
                const m = parseInt(match[1]) - 1;
                const d = parseInt(match[2]);
                // loosely match month/day. 
                // In reality, year boundary issues exist but let's assume same year for simple UI demo
                return m === date.getMonth() && d === date.getDate();
            }
            return false;
        });
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };
    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    return (
        <>
            <div className="w-full max-w-sm mx-auto bg-[#161616] border border-white/5 rounded-[32px] p-6 shadow-2xl overflow-hidden relative">

                {/* Decorative Blur */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DA291C]/10 blur-[60px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFC72C]/10 blur-[50px] pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
                        </h2>
                        <p className="text-white/40 font-medium text-sm ml-0.5">
                            {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors active:scale-95"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors active:scale-95"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>

                {loading && !events && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#FFC72C] animate-spin" />
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-7 gap-y-4 gap-x-2 relative z-10">
                    {WEEKDAYS.map(d => (
                        <div key={d} className="text-center text-[10px] uppercase tracking-wider text-white/30 font-bold">{d.replace('周', '')}</div>
                    ))}

                    {gridCells.map((date, idx) => {
                        if (!date) return <div key={idx} className="aspect-square" />;

                        const event = getEventForDate(date);
                        const isToday = new Date().toDateString() === date.toDateString();

                        return (
                            <div
                                key={idx}
                                onClick={() => event ? setSelectedEvent(event) : null}
                                className={`
                                    relative aspect-square rounded-full flex items-center justify-center transition-all duration-300
                                    ${event ? 'cursor-pointer hover:scale-110 active:scale-90 z-10' : 'text-white/20'}
                                    ${isToday && !event ? 'bg-white/10 text-white font-bold ring-1 ring-white/20' : ''}
                                    ${event && isToday ? 'ring-2 ring-white shadow-lg shadow-[#DA291C]/50' : ''}
                                `}
                            >
                                {/* Background for Event */}
                                {event && (
                                    <div className={`absolute inset-0 rounded-full opacity-100 ${isToday ? 'bg-[#DA291C]' : 'bg-[#FFC72C]'} shadow-inner`} />
                                )}

                                {/* Date Text */}
                                <span className={`relative z-10 text-xs font-medium ${event ? 'text-black font-bold' : ''}`}>
                                    {date.getDate()}
                                </span>

                                {/* Small Indicator for Event Image if available (dot) */}
                                {event && (
                                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white/50" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal Detail View */}
            {selectedEvent && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                        {/* Scrollable Content */}
                        <div className="max-h-[80vh] overflow-y-auto relative scrollbar-hide">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/10 rounded-full text-black hover:bg-black/20 backdrop-blur-md"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {selectedEvent.image && (
                                <img src={selectedEvent.image} className="w-full h-auto" alt="Detail" />
                            )}

                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold bg-[#FFC72C] text-black px-2 py-0.5 rounded">
                                        {selectedEvent.status || 'Campaign'}
                                    </span>
                                    <span className="text-xs text-gray-500 font-bold">{selectedEvent.date}</span>
                                </div>

                                <h3 className="text-2xl font-black text-black leading-tight mb-4">
                                    {selectedEvent.title}
                                </h3>

                                <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {selectedEvent.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
