import React from 'react';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

interface StopwatchControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLap: () => void;
  hasStarted: boolean;
}

export function StopwatchControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onLap,
  hasStarted
}: StopwatchControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center max-w-md mx-auto">
      {/* Start/Pause Button */}
      <Button
        onClick={isRunning ? onPause : onStart}
        size="lg"
        className={`px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
          isRunning
            ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/25'
            : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25'
        }`}
      >
        {isRunning ? (
          <>
            <Pause className="mr-2 h-5 w-5" />
            Pause
          </>
        ) : (
          <>
            <Play className="mr-2 h-5 w-5" />
            Start
          </>
        )}
      </Button>

      {/* Lap Button */}
      <Button
        onClick={onLap}
        disabled={!hasStarted}
        variant="outline"
        size="lg"
        className="px-6 py-4 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-2 hover:shadow-lg"
      >
        <Flag className="mr-2 h-5 w-5" />
        Lap
      </Button>

      {/* Reset Button */}
      <Button
        onClick={onReset}
        disabled={!hasStarted}
        variant="outline"
        size="lg"
        className="px-6 py-4 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-2 hover:shadow-lg hover:border-destructive hover:text-destructive"
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        Reset
      </Button>
    </div>
  );
}