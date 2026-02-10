import { type ReactNode } from 'react';
import { Power, RefreshCw, Moon, Lock, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type ActionType = 'shutdown' | 'restart' | 'sleep' | 'lock' | 'logoff';

interface ActionSelectorProps {
    selectedAction: ActionType;
    onSelect: (action: ActionType) => void;
    disabled?: boolean;
}

export const ActionSelector = ({ selectedAction, onSelect, disabled }: ActionSelectorProps) => {
    const actions: { id: ActionType; label: string; icon: ReactNode; color: string }[] = [
        { id: 'shutdown', label: 'Kapat', icon: <Power size={24} />, color: 'hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50' },
        { id: 'restart', label: 'Yeniden Başlat', icon: <RefreshCw size={24} />, color: 'hover:bg-green-500/20 hover:text-green-500 hover:border-green-500/50' },
        { id: 'sleep', label: 'Uyku', icon: <Moon size={24} />, color: 'hover:bg-blue-500/20 hover:text-blue-500 hover:border-blue-500/50' },
        { id: 'lock', label: 'Kilitle', icon: <Lock size={24} />, color: 'hover:bg-yellow-500/20 hover:text-yellow-500 hover:border-yellow-500/50' },
        { id: 'logoff', label: 'Oturumu Kapat', icon: <LogOut size={24} />, color: 'hover:bg-purple-500/20 hover:text-purple-500 hover:border-purple-500/50' },
    ];

    return (
        <div className="grid grid-cols-5 gap-2 mb-6">
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={() => onSelect(action.id)}
                    disabled={disabled}
                    className={twMerge(
                        "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-border bg-surface/50 transition-all duration-200 group relative overflow-hidden",
                        disabled && "opacity-50 cursor-not-allowed",
                        !disabled && action.color,
                        selectedAction === action.id && !disabled && "bg-surface border-primary ring-1 ring-primary/50 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    )}
                >
                    <div className={clsx(
                        "transition-transform duration-300 group-hover:scale-110",
                        selectedAction === action.id ? "text-primary" : "text-gray-400"
                    )}>
                        {action.icon}
                    </div>
                    {/* Tooltip-ish label for small screens if needed, strictly icon based for now but let's add text for clarity in this larger grid */}
                    <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-200 leading-tight text-center hidden sm:block">
                        {action.label}
                    </span>
                </button>
            ))}
        </div>
    );
};
