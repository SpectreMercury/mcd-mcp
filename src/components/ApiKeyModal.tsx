"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, ExternalLink, Key } from 'lucide-react';
import Image from 'next/image';

interface StoredKey {
    name: string;
    value: string;
}

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
    const [keys, setKeys] = useState<StoredKey[]>([]);
    const [activeKey, setActiveKey] = useState<string>('');

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newValue, setNewValue] = useState('');

    useEffect(() => {
        // Load from local storage
        const storedKeys = JSON.parse(localStorage.getItem('mcd_all_keys') || '[]');
        const currentActive = localStorage.getItem('mcd_api_key') || '';

        setKeys(storedKeys);
        setActiveKey(currentActive);

        // Auto-switch to adding mode if open and no keys exist
        if (isOpen && storedKeys.length === 0) {
            setIsAdding(true);
        }
    }, [isOpen]);

    const handleSaveNew = () => {
        if (!newName.trim() || !newValue.trim()) return;

        const newKeyEntry = { name: newName, value: newValue };
        const updatedKeys = [...keys, newKeyEntry];

        setKeys(updatedKeys);
        localStorage.setItem('mcd_all_keys', JSON.stringify(updatedKeys));
        handleSelectKey(newValue);

        setNewName('');
        setNewValue('');
        setIsAdding(false);
    };

    const handleSelectKey = (value: string) => {
        setActiveKey(value);
        localStorage.setItem('mcd_api_key', value);
        // Determine if we should close. Use a small timeout for visual feedback
        if (activeKey !== value) {
            setTimeout(() => onClose(), 500);
        }
    };

    const handleDelete = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const updatedKeys = keys.filter((_, i) => i !== index);
        setKeys(updatedKeys);
        localStorage.setItem('mcd_all_keys', JSON.stringify(updatedKeys));

        if (keys[index].value === activeKey) {
            setActiveKey('');
            localStorage.removeItem('mcd_api_key');
        }
    };

    const canClose = !!activeKey;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md transition-all duration-300">
            <div className="bg-[#1a1a1a] w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 ring-1 ring-white/10 font-sans">

                {/* Header - Dark Theme with Logo */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 relative">
                            <Image
                                src="/mcd-logo.svg"
                                alt="McDonald's"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold text-white tracking-wide">安全验证</h2>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">MCP Security</span>
                        </div>
                    </div>
                    {canClose && (
                        <button
                            onClick={onClose}
                            className="text-white/40 hover:text-white transition-colors p-2"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">

                    {!isAdding ? (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-white/50">已保存的密钥</p>
                            </div>

                            {keys.length > 0 ? (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                    {keys.map((k, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleSelectKey(k.value)}
                                            className={`
                                        group relative flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300
                                        ${activeKey === k.value
                                                    ? 'bg-white/10 shadow-[0_0_20px_rgba(255,199,44,0.1)] border border-[#FFC72C]/30'
                                                    : 'bg-white/5 border border-transparent hover:bg-white/10'
                                                }
                                    `}
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className={`
                                            w-2 h-2 rounded-full flex-shrink-0 shadow-[0_0_10px_currentColor]
                                            ${activeKey === k.value ? 'bg-[#FFC72C] text-[#FFC72C]' : 'bg-white/20 text-white/20'}
                                        `} />
                                                <div className="flex flex-col min-w-0">
                                                    <span className={`text-sm font-medium truncate ${activeKey === k.value ? 'text-white' : 'text-white/70'}`}>
                                                        {k.name}
                                                    </span>
                                                    <span className="text-[10px] text-white/30 truncate font-mono">
                                                        {k.value.slice(0, 12)}...
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => handleDelete(e, idx)}
                                                    className="p-2 text-white/20 hover:text-red-400 hover:bg-white/5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                    <Key className="w-8 h-8 text-white/10 mx-auto mb-2" />
                                    <p className="text-xs text-white/30">暂无配置</p>
                                </div>
                            )}

                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full py-3.5 rounded-xl bg-[#FFC72C] text-black text-sm font-bold shadow-[0_4px_20px_rgba(255,199,44,0.3)] hover:shadow-[0_4px_25px_rgba(255,199,44,0.5)] hover:bg-[#ffcf4b] transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                添加新配置
                            </button>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                            <h3 className="text-sm font-bold text-white mb-6">新增配置</h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">
                                        备注名称
                                    </label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="例如: 个人测试"
                                        className="w-full bg-white/5 border border-white/10 focus:border-[#FFC72C] focus:bg-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">
                                        API Key
                                    </label>
                                    <div className="relative group">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#FFC72C] transition-colors" />
                                        <input
                                            type="password"
                                            value={newValue}
                                            onChange={(e) => setNewValue(e.target.value)}
                                            placeholder="sk-..."
                                            className="w-full bg-white/5 border border-white/10 focus:border-[#FFC72C] focus:bg-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none font-mono transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={handleSaveNew}
                                        disabled={!newName.trim() || !newValue.trim()}
                                        className="flex-1 py-3 rounded-xl bg-[#DA291C] text-white text-sm font-bold shadow-[0_4px_20px_rgba(218,41,28,0.4)] hover:bg-[#e03a2e] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-95"
                                    >
                                        确认保存
                                    </button>
                                </div>
                                <div className="text-center pt-2">
                                    <a
                                        href="https://open.mcd.cn/mcp"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-white/30 text-[10px] hover:text-[#FFC72C] transition-colors group"
                                    >
                                        <span>没有 Key? 前往申请</span>
                                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Link */}
                    {!isAdding && (
                        <div className="mt-8 text-center pt-4 border-t border-white/5">
                            <a
                                href="https://open.mcd.cn/mcp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-white/30 text-[10px] hover:text-[#FFC72C] transition-colors group"
                            >
                                <span>没有 Key? 前往申请</span>
                                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
