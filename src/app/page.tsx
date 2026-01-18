"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import ApiKeyModal from "@/components/ApiKeyModal";
import CampaignCalendar from "@/components/CampaignCalendar";
import AvailableCoupons from "@/components/AvailableCoupons";
import MyCoupons from "@/components/MyCoupons";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentKey, setCurrentKey] = useState<string>('');

  useEffect(() => {
    // Initial check just in case, though modal handles it too, 
    // but having it here makes it cleaner if we want to force open
    const activeKey = localStorage.getItem('mcd_api_key');
    if (!activeKey) {
      setIsKeyModalOpen(true);
    } else {
      // Start...End masking
      if (activeKey.length > 8) {
        setCurrentKey(activeKey.substring(0, 4) + '....' + activeKey.substring(activeKey.length - 4));
      } else {
        setCurrentKey(activeKey);
      }
    }
  }, [isKeyModalOpen]); // Re-run when modal closes to update displayed key

  return (
    <main className="min-h-screen bg-black text-white font-sans flex flex-col">
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />

      <div className="flex-1 w-full max-w-lg mx-auto">

        {!isKeyModalOpen && (
          <div className="animate-in fade-in zoom-in-95 duration-300">

            {activeTab === 'calendar' && (
              <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center p-4">
                <CampaignCalendar />
              </div>
            )}

            {activeTab === 'coupons' && (
              <div className="pt-6">
                <AvailableCoupons />
              </div>
            )}

            {activeTab === 'mine' && (
              <div className="space-y-4 pt-6">
                <div
                  onClick={() => setIsKeyModalOpen(true)}
                  className="flex items-center gap-4 p-5 bg-[#1a1a1a] rounded-2xl border border-white/5 mx-5 shadow-lg relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform hover:border-white/10"
                >
                  {/* Decorative glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFC72C]/5 blur-3xl rounded-full" />

                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#FFC72C] to-[#E8B923] flex items-center justify-center text-black font-black text-2xl shadow-inner ring-4 ring-black/20">
                    M
                  </div>
                  <div className="relative">
                    <h3 className="font-bold text-xl text-white tracking-tight">My Account</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                      <p className="text-white/40 text-xs font-medium font-mono">
                        {currentKey || 'No API Key'}
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-white/20 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5 group-hover:bg-white/10 transition-colors">
                    切换
                  </div>
                </div>
                <MyCoupons />

                <div className="pb-20" />
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}
