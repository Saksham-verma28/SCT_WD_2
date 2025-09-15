import React from 'react';
import { Button } from './ui/button';
import { Play, Pause, Square, RotateCcw, Flag, Download, Share2, Settings } from 'lucide-react';

interface ControlsProps {
  isRunning: boolean;
  time: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onLap: () => void;
  onExport: () => void;
  onShare: () => void;
  onSettings: () => void;
}

export function Controls({
  isRunning,
  time,
  onStart,
  onStop,
  onReset,
  onLap,
  onExport,
  onShare,
  onSettings
}: ControlsProps) {
  return (
    <div className="space-y-6">
      {/* Primary Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={isRunning ? onStop : onStart}
          size="lg"
          className={`w-24 h-24 rounded-full text-lg ${
            isRunning 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-8 h-8" />
              <span className="sr-only">Stop</span>
            </>
          ) : (
            <>
              <Play className="w-8 h-8 ml-1" />
              <span className="sr-only">Start</span>
            </>
          )}
        </Button>
        
        <Button
          onClick={onLap}
          disabled={!isRunning}
          size="lg"
          variant="outline"
          className="w-24 h-24 rounded-full"
        >
          <Flag className="w-6 h-6" />
          <span className="sr-only">Lap</span>
        </Button>
        
        <Button
          onClick={onReset}
          disabled={isRunning}
          size="lg"
          variant="outline"
          className="w-24 h-24 rounded-full"
        >
          <RotateCcw className="w-6 h-6" />
          <span className="sr-only">Reset</span>
        </Button>
      </div>
      
      {/* Secondary Controls */}
      <div className="flex justify-center gap-2">
        <Button
          onClick={onExport}
          disabled={time === 0}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
        
        <Button
          onClick={onShare}
          disabled={time === 0}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        
        <Button
          onClick={onSettings}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
      
      {/* Keyboard Shortcuts Hint */}
      <div className="text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-4">
          <span><kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd> Start/Stop</span>
          <span><kbd className="px-2 py-1 bg-muted rounded text-xs">L</kbd> Lap</span>
          <span><kbd className="px-2 py-1 bg-muted rounded text-xs">R</kbd> Reset</span>
        </div>
      </div>
    </div>
  );
}
