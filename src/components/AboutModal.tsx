import { X, ExternalLink, Zap, Shield, Clock, Monitor } from 'lucide-react';
import { open } from '@tauri-apps/plugin-shell';
import { useEffect, useState } from 'react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Small delay for mount animation
            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const features = [
        { icon: <Zap size={14} />, label: 'Hızlı & Hafif' },
        { icon: <Shield size={14} />, label: 'Güvenli (0/71)' },
        { icon: <Clock size={14} />, label: 'Hassas Zamanlama' },
        { icon: <Monitor size={14} />, label: 'Taşınabilir' },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Backdrop */}
            <div className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`} />

            {/* Modal Card */}
            <div className={`relative w-[340px] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111111] shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-all duration-500 ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>

                {/* Ambient Glow - top */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all duration-200 group"
                >
                    <X size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Content */}
                <div className="relative px-6 pt-8 pb-6 flex flex-col items-center">

                    {/* Logo with animated ring */}
                    <div className="relative mb-5">
                        {/* Outer glow ring */}
                        <div className="absolute inset-[-8px] rounded-[28px] bg-gradient-to-br from-primary/30 via-amber-600/10 to-transparent animate-pulse" />
                        {/* Logo container */}
                        <div className="relative w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/[0.08] flex items-center justify-center shadow-[0_8px_32px_rgba(245,158,11,0.15),inset_0_1px_0_rgba(255,255,255,0.05)]">
                            <img
                                src="/logo.png"
                                alt="Bilgisayar Kapatıcı"
                                className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-[17px] font-bold text-white tracking-tight">
                        Bilgisayar Kapatıcı
                    </h2>

                    {/* Version Badge */}
                    <div className="mt-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-[11px] font-semibold text-primary tracking-wider">v1.0.1</span>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-[13px] text-gray-400 text-center leading-relaxed max-w-[260px]">
                        Minimalist, hızlı ve güvenilir Windows sistem zamanlayıcı aracı.
                    </p>

                    {/* Feature Grid */}
                    <div className="mt-5 grid grid-cols-2 gap-2 w-full">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] group hover:border-primary/20 hover:bg-primary/[0.03] transition-all duration-300"
                            >
                                <span className="text-primary/70 group-hover:text-primary transition-colors">
                                    {feature.icon}
                                </span>
                                <span className="text-[11px] text-gray-400 group-hover:text-gray-300 font-medium transition-colors">
                                    {feature.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="mt-5 w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                    {/* Developer Section */}
                    <div className="mt-4 flex flex-col items-center gap-3 w-full">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-600 uppercase tracking-[0.15em]">Geliştiren</span>
                            <span className="text-[13px] font-bold text-white">sc0x01</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 w-full">
                            <button
                                onClick={() => open('https://sc0x01.com')}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 text-primary hover:text-white transition-all duration-300 group"
                            >
                                <span className="text-[12px] font-semibold">sc0x01.com</span>
                                <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </button>
                            <button
                                onClick={() => open('https://github.com/sc0x01/bilgisayar-kapatici')}
                                className="flex items-center justify-center w-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-gray-500 hover:text-white transition-all duration-300"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Copyright */}
                    <p className="mt-4 text-[10px] text-gray-700 font-mono">
                        © 2026 sc0x01 — Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </div>
    );
};
