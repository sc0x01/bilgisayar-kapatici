import { XCircle } from 'lucide-react';

interface TimerDisplayProps {
    remainingSeconds: number;
    totalSeconds: number;
    actionLabel: string;
    onCancel: () => void;
}

export const TimerDisplay = ({ remainingSeconds, totalSeconds, actionLabel, onCancel }: TimerDisplayProps) => {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    const formatTime = (val: number) => val.toString().padStart(2, '0');

    // Calculate progress percentage for SVG circle
    const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center flex-1 relative animate-in fade-in zoom-in duration-300">
            {/* Circle Progress */}
            <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        className="stroke-surface fill-none"
                        strokeWidth="12"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        className="stroke-primary fill-none transition-all duration-1000 ease-linear"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Time Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">{actionLabel}</span>
                    <div className="text-5xl font-bold font-mono tracking-tighter text-white tabular-nums">
                        {hours > 0 && <span className="text-4xl">{formatTime(hours)}<span className="text-gray-600 text-2xl mx-1">:</span></span>}
                        {formatTime(minutes)}
                        <span className="text-gray-600 text-2xl mx-1">:</span>
                        {formatTime(seconds)}
                    </div>
                </div>
            </div>

            {/* Cancel Button */}
            <button
                onClick={onCancel}
                className="mt-8 flex items-center gap-2 px-6 py-3 bg-surface border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all duration-300 font-bold shadow-lg hover:shadow-red-500/20 group"
            >
                <XCircle size={20} className="group-hover:rotate-90 transition-transform" />
                İPTAL ET
            </button>
        </div>
    );
};
