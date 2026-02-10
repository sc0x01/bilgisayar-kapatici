import { X, ExternalLink } from 'lucide-react';
import { open } from '@tauri-apps/plugin-shell';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border border-border w-80 p-6 rounded-2xl shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-black border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-white">Bilgisayar Kapatıcı</h2>
                        <p className="text-xs text-primary font-mono mt-1">v1.0.0</p>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed px-2">
                        Basit, güvenilir ve modern bir sistem zamanlayıcı.<br />
                        <span className="text-xs opacity-50 block mt-2">Tasarlayan & Geliştiren</span>
                        <span className="font-bold text-white">sc0x01</span>
                    </p>

                    <div className="flex gap-2 w-full pt-2">
                        <button
                            onClick={() => open('https://sc0x01.com')}
                            className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary hover:text-white border border-primary/20 rounded-lg py-2 transition-all text-xs font-semibold group"
                        >
                            <span>sc0x01.com</span>
                            <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        {/* Optional Github Button if needed later
                        <button 
                            onClick={() => open('https://github.com/sc0x01')}
                            className="flex items-center justify-center w-10 bg-surface border border-border hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <Github size={16} />
                        </button>
                        */}
                    </div>

                    <div className="text-[10px] text-gray-600 font-mono pt-4 border-t border-border w-full">
                        © 2026 sc0x01.com
                    </div>
                </div>
            </div>
        </div>
    );
};
