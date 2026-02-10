import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Layout } from "./layouts/Layout";
import { ActionSelector, ActionType } from "./components/ActionSelector";
import { TimeSelector } from "./components/TimeSelector";
import { TimerDisplay } from "./components/TimerDisplay";
import { Play } from "lucide-react";

function App() {
  const [selectedAction, setSelectedAction] = useState<ActionType>('shutdown');
  const [scheduledTime, setScheduledTime] = useState(0); // in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const handleTimeSet = useCallback((seconds: number) => {
    setScheduledTime(seconds);
  }, []);

  // Timer Effect (Visual only)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isTimerRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (remainingTime === 0) {
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, remainingTime]);

  // Handler for Start
  const handleStart = async () => {
    if (scheduledTime <= 0) return;

    // 1. Start Visual Timer Immediately (Optimistic)
    setTotalTime(scheduledTime);
    setRemainingTime(scheduledTime);
    setIsTimerRunning(true);

    try {
      // 2. Schedule in Backend asynchronously
      await invoke('execute_system_command', {
        action: selectedAction,
        seconds: scheduledTime
      });
    } catch (error) {
      console.error("Failed to schedule:", error);
      alert(`Hata: ${error}`);
      // Revert if backend fails
      setIsTimerRunning(false);
      setRemainingTime(0);
    }
  };

  // Handler for Cancel
  const handleCancel = () => {
    // 1. Synchronous Optimistic Update
    // Immediate UI feedback. No waiting.
    setIsTimerRunning(false);
    setRemainingTime(0);

    // 2. Fire-and-forget Backend Call
    // Do not await. Let it run in background.
    invoke('cancel_schedule').catch((error) => {
      console.error("Failed to cancel schedule:", error);
      // We purposefully do NOT revert UI state here.
      // If the user wants to stop, the UI should show 'stopped'.
    });
  };

  const getActionLabel = (loading: ActionType) => {
    switch (loading) {
      case 'shutdown': return 'Kapatılıyor...';
      case 'restart': return 'Yeniden Başlatılıyor...';
      case 'sleep': return 'Uyku Modu...';
      case 'lock': return 'Kilitleniyor...';
      case 'logoff': return 'Oturum Kapatılıyor...';
      default: return 'Geri Sayım';
    }
  };

  return (
    <Layout>
      <div className="h-full flex flex-col">
        {!isTimerRunning ? (
          <>
            <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-surface/30 p-4 rounded-2xl border border-white/5">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">İşlem Seçin</h2>
                <ActionSelector
                  selectedAction={selectedAction}
                  onSelect={setSelectedAction}
                />
              </div>

              <div className="bg-surface/30 p-4 rounded-2xl border border-white/5 flex-1">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Zaman Ayarla</h2>
                <TimeSelector onTimeSet={handleTimeSet} />
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={scheduledTime <= 0}
              className={`mt-4 w-full py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${scheduledTime > 0
                ? 'bg-primary hover:bg-primary-hover text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] translate-y-0'
                : 'bg-surface text-gray-500 cursor-not-allowed translate-y-2 opacity-50'
                }`}
            >
              <Play size={20} className="fill-current" />
              Zamanlayıcıyı Başlat
            </button>
          </>
        ) : (
          <TimerDisplay
            remainingSeconds={remainingTime}
            totalSeconds={totalTime}
            actionLabel={getActionLabel(selectedAction)}
            onCancel={handleCancel}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;
