import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer } from './components/Timer';
import { Controls } from './components/Controls';
import { LapsList } from './components/LapsList';
import { Statistics } from './components/Statistics';
import { SettingsDialog } from './components/SettingsDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent } from './components/ui/card';
import { toast } from 'sonner@2.0.3';

interface Lap {
  id: number;
  time: number;
  lapTime: number;
  timestamp: Date;
}

interface Settings {
  soundEnabled: boolean;
  precision: 'seconds' | 'centiseconds' | 'milliseconds';
  theme: 'light' | 'dark' | 'system';
  autoLap: boolean;
  vibration: boolean;
}

export default function App() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | undefined>();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    precision: 'centiseconds',
    theme: 'system',
    autoLap: false,
    vibration: true
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastLapTime = useRef(0);
  const autoLapRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Auto-lap functionality
  useEffect(() => {
    if (isRunning && settings.autoLap) {
      autoLapRef.current = setInterval(() => {
        handleLap();
      }, 60000); // Every minute
    } else {
      if (autoLapRef.current) {
        clearInterval(autoLapRef.current);
      }
    }

    return () => {
      if (autoLapRef.current) {
        clearInterval(autoLapRef.current);
      }
    };
  }, [isRunning, settings.autoLap]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return; // Don't trigger shortcuts when typing in inputs
      }

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          handleStartStop();
          break;
        case 'l':
          event.preventDefault();
          if (isRunning) handleLap();
          break;
        case 'r':
          event.preventDefault();
          if (!isRunning) handleReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning]);

  // Sound effects
  const playSound = useCallback((type: 'start' | 'stop' | 'lap' | 'reset') => {
    if (!settings.soundEnabled) return;
    
    // Create audio context for beep sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different actions
    const frequencies = {
      start: 880,   // A5
      stop: 440,    // A4
      lap: 660,     // E5
      reset: 330    // E4
    };
    
    oscillator.frequency.value = frequencies[type];
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [settings.soundEnabled]);

  // Vibration feedback
  const vibrate = useCallback((pattern: number[]) => {
    if (!settings.vibration || !navigator.vibrate) return;
    navigator.vibrate(pattern);
  }, [settings.vibration]);

  const handleStartStop = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (!sessionStartTime) {
        setSessionStartTime(new Date());
      }
      playSound('start');
      vibrate([50]);
      toast.success('Timer started');
    } else {
      setIsRunning(false);
      playSound('stop');
      vibrate([100]);
      toast.info('Timer stopped');
    }
  };

  const handleLap = () => {
    if (!isRunning || time === 0) return;
    
    const lapTime = time - lastLapTime.current;
    const newLap: Lap = {
      id: Date.now(),
      time: time,
      lapTime: lapTime,
      timestamp: new Date()
    };
    
    setLaps(prev => [...prev, newLap]);
    lastLapTime.current = time;
    
    playSound('lap');
    vibrate([30, 30, 30]);
    toast.success(`Lap ${laps.length + 1} recorded`);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    setSessionStartTime(undefined);
    lastLapTime.current = 0;
    
    playSound('reset');
    vibrate([200]);
    toast.info('Timer reset');
  };

  const handleExport = () => {
    if (time === 0 && laps.length === 0) {
      toast.error('No data to export');
      return;
    }

    const data = {
      totalTime: time,
      laps: laps,
      sessionStartTime: sessionStartTime,
      exportDate: new Date().toISOString(),
      settings: settings
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stopwatch-session-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Session data exported');
  };

  const handleShare = async () => {
    if (time === 0 && laps.length === 0) {
      toast.error('No data to share');
      return;
    }

    const formatTime = (ms: number) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const centiseconds = Math.floor((ms % 1000) / 10);
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    };

    const shareText = `🏃‍♂️ Stopwatch Session
⏱️ Total Time: ${formatTime(time)}
🏁 Laps: ${laps.length}
${laps.length > 0 ? `🥇 Best Lap: ${formatTime(Math.min(...laps.map(l => l.lapTime)))}` : ''}

#stopwatch #timing`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Stopwatch Session',
          text: shareText,
        });
        toast.success('Session shared');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          fallbackShare(shareText);
        }
      }
    } else {
      fallbackShare(shareText);
    }
  };

  const fallbackShare = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Session data copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Theme handling
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (theme: string) => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme(settings.theme);

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Professional Stopwatch
          </h1>
          <p className="text-muted-foreground">
            Precision timing with advanced features and analytics
          </p>
        </div>

        {/* Main Timer */}
        <Card>
          <CardContent className="p-8">
            <Timer time={time} isRunning={isRunning} />
            <Controls
              isRunning={isRunning}
              time={time}
              onStart={handleStartStop}
              onStop={handleStartStop}
              onReset={handleReset}
              onLap={handleLap}
              onExport={handleExport}
              onShare={handleShare}
              onSettings={() => setSettingsOpen(true)}
            />
          </CardContent>
        </Card>

        {/* Tabs for additional content */}
        <Tabs defaultValue="laps" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="laps">Laps</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="laps" className="mt-6">
            <LapsList laps={laps} currentTime={time} />
          </TabsContent>
          
          <TabsContent value="statistics" className="mt-6">
            <Statistics 
              totalTime={time} 
              laps={laps} 
              isRunning={isRunning}
              sessionStartTime={sessionStartTime}
            />
          </TabsContent>
        </Tabs>

        {/* Settings Dialog */}
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          settings={settings}
          onSettingsChange={setSettings}
        />
      </div>
    </div>
  );
}
