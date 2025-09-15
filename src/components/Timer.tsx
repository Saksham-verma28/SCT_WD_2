import React from 'react';

interface TimerProps {
  time: number;
  isRunning: boolean;
  className?: string;
}

export function Timer({ time, isRunning, className = '' }: TimerProps) {
  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: ms.toString().padStart(2, '0')
    };
  };

  const { hours, minutes, seconds, milliseconds } = formatTime(time);

  return (
    <div className={`relative ${className}`}>
      {/* Animated Background Ring */}
      <div className="relative w-80 h-80 mx-auto mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
          {/* Background Circle */}
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="none"
            stroke="rgb(229 231 235)"
            strokeWidth="4"
            className="dark:stroke-gray-700"
          />
          
          {/* Progress Circle */}
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 150}`}
            strokeDashoffset={`${2 * Math.PI * 150 * (1 - (time % 60000) / 60000)}`}
            className="transition-all duration-75 ease-linear"
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <div className="bg-card rounded-lg px-3 py-2 shadow-sm border">
                <span className="text-2xl font-mono">{hours}</span>
              </div>
              <span className="text-xl text-muted-foreground">:</span>
              <div className="bg-card rounded-lg px-3 py-2 shadow-sm border">
                <span className="text-2xl font-mono">{minutes}</span>
              </div>
              <span className="text-xl text-muted-foreground">:</span>
              <div className="bg-card rounded-lg px-3 py-2 shadow-sm border">
                <span className="text-2xl font-mono">{seconds}</span>
              </div>
              <span className="text-lg text-muted-foreground">.</span>
              <div className="bg-card rounded-lg px-2 py-2 shadow-sm border">
                <span className="text-lg font-mono">{milliseconds}</span>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`} />
              <span className="text-sm text-muted-foreground">
                {isRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}