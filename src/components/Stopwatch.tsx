import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';

interface StopwatchProps {
  isRunning: boolean;
  onTimeUpdate: (time: number) => void;
  resetTrigger: boolean;
}

export function Stopwatch({ isRunning, onTimeUpdate, resetTrigger }: StopwatchProps) {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 10;
          onTimeUpdate(newTime);
          return newTime;
        });
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  useEffect(() => {
    if (resetTrigger) {
      setTime(0);
      onTimeUpdate(0);
    }
  }, [resetTrigger, onTimeUpdate]);

  const formatTime = (milliseconds: number) => {
    const totalMs = Math.floor(milliseconds);
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const ms = Math.floor((totalMs % 1000) / 10);

    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: ms.toString().padStart(2, '0')
    };
  };

  const timeDisplay = formatTime(time);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-background via-background to-accent/20 border-2 shadow-2xl">
      <CardContent className="p-12">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="text-8xl sm:text-9xl font-mono font-bold tracking-wider text-foreground">
              <span className="inline-block min-w-[1.2ch]">{timeDisplay.minutes}</span>
              <span className="text-muted-foreground mx-2">:</span>
              <span className="inline-block min-w-[1.2ch]">{timeDisplay.seconds}</span>
            </div>
            <div className="text-4xl font-mono font-medium text-muted-foreground mt-2">
              .{timeDisplay.milliseconds}
            </div>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/20"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className={`text-primary transition-all duration-300 ${
                  isRunning ? 'animate-pulse' : ''
                }`}
                strokeDasharray={`${(time % 60000) / 60000 * 352} 352`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                isRunning ? 'bg-primary animate-ping' : 'bg-muted-foreground'
              }`} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}