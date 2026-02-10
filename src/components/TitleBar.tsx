import { Minus, X, Info } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';

interface TitleBarProps {
    onInfoClick?: () => void;
}

export const TitleBar = ({ onInfoClick }: TitleBarProps) => {
    const appWindow = getCurrentWindow();

    return (
        <div className="h-10 bg-surface flex items-center justify-between px-4 select-none border-b border-border rounded-t-xl overflow-hidden">
            {/* Left Side: Drag Region + Title */}
            {/* This entire area is draggable. Buttons are NOT inside this div. */}
            <div data-tauri-drag-region className="flex-1 flex items-center gap-2 h-full cursor-default">
                <img src="/logo.png" className="w-4 h-4 object-contain pointer-events-none" alt="logo" /> {/* Use actual logo */}
                <span className="text-xs font-bold text-gray-300 tracking-wider pointer-events-none">BILGISAYAR KAPATICI</span>
            </div>

            {/* Right Side: Window Controls */}
            {/* This area is NOT draggable, ensuring buttons always receive clicks. */}
            <div className="flex items-center gap-1 shrink-0 h-full pl-2">
                <button
                    onClick={onInfoClick}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-primary hover:text-primary-hover cursor-pointer mr-1"
                    title="Hakkında"
                >
                    <Info size={14} />
                </button>
                <button
                    onClick={() => appWindow.minimize()}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white cursor-pointer"
                >
                    <Minus size={14} />
                </button>
                <button
                    onClick={() => appWindow.close()}
                    className="p-1.5 hover:bg-red-500/20 hover:text-red-500 rounded-md transition-colors text-gray-400 cursor-pointer"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};
