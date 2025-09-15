import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, TrendingDown, TrendingUp, Flag } from 'lucide-react';

interface Lap {
  id: number;
  time: number;
  lapTime: number;
  timestamp: Date;
}

interface LapsListProps {
  laps: Lap[];
  currentTime: number;
}

export function LapsList({ laps, currentTime }: LapsListProps) {
  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const getLapAnalysis = () => {
    if (laps.length < 2) return null;
    
    const lapTimes = laps.map(lap => lap.lapTime);
    const bestLap = Math.min(...lapTimes);
    const worstLap = Math.max(...lapTimes);
    const avgLap = lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length;
    
    return { bestLap, worstLap, avgLap };
  };

  const analysis = getLapAnalysis();

  const getBadgeForLap = (lapTime: number) => {
    if (!analysis) return null;
    
    if (lapTime === analysis.bestLap) {
      return <Badge variant="default" className="bg-green-500"><Trophy className="w-3 h-3 mr-1" />Best</Badge>;
    }
    if (lapTime === analysis.worstLap) {
      return <Badge variant="destructive"><TrendingDown className="w-3 h-3 mr-1" />Slowest</Badge>;
    }
    if (lapTime < analysis.avgLap) {
      return <Badge variant="secondary"><TrendingUp className="w-3 h-3 mr-1" />Above Avg</Badge>;
    }
    return null;
  };

  if (laps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lap Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Flag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No laps recorded yet</p>
            <p className="text-sm">Press the lap button while the timer is running</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Lap Times
          <Badge variant="outline">{laps.length} laps</Badge>
        </CardTitle>
        
        {analysis && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-muted-foreground">Best</div>
              <div className="font-mono text-green-600">{formatTime(analysis.bestLap)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Average</div>
              <div className="font-mono">{formatTime(analysis.avgLap)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Worst</div>
              <div className="font-mono text-red-600">{formatTime(analysis.worstLap)}</div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {[...laps].reverse().map((lap, index) => (
            <div
              key={lap.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                  {laps.length - index}
                </div>
                <div>
                  <div className="font-mono">{formatTime(lap.lapTime)}</div>
                  <div className="text-xs text-muted-foreground">
                    Total: {formatTime(lap.time)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getBadgeForLap(lap.lapTime)}
                <div className="text-xs text-muted-foreground">
                  {lap.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}