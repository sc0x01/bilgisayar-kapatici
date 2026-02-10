import { useState, useEffect } from 'react';
import { Clock, Calendar, ChevronUp, ChevronDown } from 'lucide-react';

interface TimeSelectorProps {
    onTimeSet: (seconds: number) => void;
    disabled?: boolean;
}

export const TimeSelector = ({ onTimeSet, disabled }: TimeSelectorProps) => {
    const [mode, setMode] = useState<'countdown' | 'specific'>('countdown');
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);

    useEffect(() => {
        const totalSeconds = (hours * 3600) + (minutes * 60);
        onTimeSet(totalSeconds);
    }, [hours, minutes, onTimeSet]);

    const presets = [
        { label: '+15 dk', value: 15 },
        { label: '+30 dk', value: 30 },
        { label: '+1 saat', value: 60 },
        { label: '+2 saat', value: 120 },
    ];

    const addTime = (mins: number) => {
        let newMinutes = minutes + mins;
        let newHours = hours;

        while (newMinutes >= 60) {
            newMinutes -= 60;
            newHours += 1;
        }

        setMinutes(newMinutes);
        setHours(newHours);
    };

    return (
        <div className={`flex flex-col gap-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Mode Switcher */}
            <div className="flex bg-surface rounded-lg p-1 border border-border">
                <button
                    onClick={() => setMode('countdown')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'countdown' ? 'bg-background text-primary shadow-sm' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <Clock size={14} />
                    Geri Sayım
                </button>
                <button
                    onClick={() => setMode('specific')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'specific' ? 'bg-background text-primary shadow-sm' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <Calendar size={14} />
                    Tarih & Saat
                </button>
            </div>

            {mode === 'countdown' && (
                <div className="flex flex-col gap-4">
                    {/* Time Inputs */}
                    <div className="flex items-center justify-center gap-4 py-4">
                        {/* Hours */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-gray-500 uppercase tracking-widest">Saat</span>
                            <div className="flex flex-col items-center bg-surface border border-border rounded-2xl p-1">
                                <button
                                    onClick={() => setHours(h => h + 1)}
                                    className="p-1 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-colors w-full flex justify-center"
                                >
                                    <ChevronUp size={16} />
                                </button>
                                <input
                                    type="number"
                                    min="0"
                                    value={hours}
                                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-16 h-12 bg-transparent text-3xl font-bold text-center text-white outline-none"
                                />
                                <button
                                    onClick={() => setHours(h => Math.max(0, h - 1))}
                                    className="p-1 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-colors w-full flex justify-center"
                                >
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>

                        <span className="text-2xl font-bold text-border -mt-6">:</span>

                        {/* Minutes */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-gray-500 uppercase tracking-widest">Dakika</span>
                            <div className="flex flex-col items-center bg-surface border border-border rounded-2xl p-1">
                                <button
                                    onClick={() => setMinutes(m => m >= 59 ? 0 : m + 1)}
                                    className="p-1 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-colors w-full flex justify-center"
                                >
                                    <ChevronUp size={16} />
                                </button>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={minutes}
                                    onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                                    className="w-16 h-12 bg-transparent text-3xl font-bold text-center text-white outline-none"
                                />
                                <button
                                    onClick={() => setMinutes(m => m <= 0 ? 59 : m - 1)}
                                    className="p-1 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-colors w-full flex justify-center"
                                >
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="grid grid-cols-4 gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => addTime(preset.value)}
                                className="py-2 px-3 bg-surface hover:bg-surface/80 border border-border hover:border-primary/30 rounded-lg text-xs font-medium text-gray-300 transition-colors"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'specific' && (
                <div className="flex flex-col gap-6 py-4">
                    <div className="flex gap-4">
                        <div className="flex-1 flex flex-col gap-2">
                            <span className="text-xs text-gray-500 uppercase tracking-widest">Tarih</span>
                            <div className="relative group">
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        const date = e.target.value;
                                        const timeInput = document.getElementById('time-input') as HTMLInputElement;
                                        const time = timeInput?.value || '00:00';

                                        if (date && time) {
                                            const target = new Date(`${date}T${time}`);
                                            const now = new Date();
                                            const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
                                            if (diff > 0) onTimeSet(diff);
                                            else onTimeSet(0);
                                        }
                                    }}
                                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors appearance-none cursor-pointer [color-scheme:dark]"
                                />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" size={16} />
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                            <span className="text-xs text-gray-500 uppercase tracking-widest">Saat</span>
                            <div className="relative group">
                                <input
                                    id="time-input"
                                    type="time"
                                    onChange={(e) => {
                                        const time = e.target.value;
                                        const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
                                        const date = dateInput?.value;

                                        if (date && time) {
                                            const target = new Date(`${date}T${time}`);
                                            const now = new Date();
                                            const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
                                            if (diff > 0) onTimeSet(diff);
                                            else onTimeSet(0);
                                        }
                                    }}
                                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors appearance-none cursor-pointer [color-scheme:dark]"
                                />
                                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-gray-500">Seçilen tarihte işlem otomatik uygulanır.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
