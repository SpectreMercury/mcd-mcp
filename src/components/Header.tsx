import React from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  onOpenKeySettings: () => void;
}

export default function Header({ onOpenKeySettings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-white/5 pt-safe-top">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <Image
              src="/mcd-logo.svg"
              alt="McDonald's"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-sm font-bold text-white tracking-wide">
            MCP Platform
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenKeySettings}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#FFC72C] transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
