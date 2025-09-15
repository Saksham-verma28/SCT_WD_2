import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Trophy, Clock } from 'lucide-react';

interface LapTime {
  id: number;
  time: number;
  lapTime: number;
}

interface LapTimesProps {
  lapTimes: LapTime[];
}

export function LapTimes({ lapTimes }: LapTimesProps) {
  const formatTime = (milliseconds: number) => {
    const totalMs = Math.floor(milliseconds);
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const ms = Math.floor((totalMs % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const getBestLap = () => {
    if (lapTimes.length === 0) return null;
    return lapTimes.reduce((best, current) => 
      current.lapTime < best.lapTime ? current : best
    );
  };

  const getWorstLap = () => {
    if (lapTimes.length === 0) return null;
    return lapTimes.reduce((worst, current) => 
      current.lapTime > worst.lapTime ? current : worst
    );
  };

  const bestLap = getBestLap();
  const worstLap = getWorstLap();

  if (lapTimes.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No lap times recorded yet</p>
            <p className="text-sm mt-2">Start the stopwatch and press "Lap" to record times</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Lap Times ({lapTimes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 w-full pr-4">
          <div className="space-y-3">
            {[...lapTimes].reverse().map((lap, index) => {
              const isRecentLap = index === 0;
              const isBestLap = bestLap && lap.id === bestLap.id;
              const isWorstLap = worstLap && lap.id === worstLap.id && lapTimes.length > 2;
              
              return (
                <div
                  key={lap.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                    isRecentLap
                      ? 'bg-primary/10 border-2 border-primary/20 shadow-sm'
                      : isBestLap
                      ? 'bg-green-50 border-2 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : isWorstLap
                      ? 'bg-red-50 border-2 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                      : 'bg-muted/30 border border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      isRecentLap
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted-foreground/20 text-muted-foreground'
                    }`}>
                      {lapTimes.length - index}
                    </div>
                    
                    <div>
                      <div className="font-mono font-semibold">
                        {formatTime(lap.lapTime)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total: {formatTime(lap.time)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isRecentLap && (
                      <Badge variant="default" className="text-xs">
                        Latest
                      </Badge>
                    )}
                    {isBestLap && (
                      <Badge variant="outline" className="text-xs border-green-500 text-green-700 dark:text-green-400">
                        Best
                      </Badge>
                    )}
                    {isWorstLap && (
                      <Badge variant="outline" className="text-xs border-red-500 text-red-700 dark:text-red-400">
                        Worst
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {lapTimes.length > 1 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Total Laps</div>
                <div className="font-semibold">{lapTimes.length}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Best Lap</div>
                <div className="font-mono font-semibold text-green-600 dark:text-green-400">
                  {bestLap && formatTime(bestLap.lapTime)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Average Lap</div>
                <div className="font-mono font-semibold">
                  {formatTime(
                    lapTimes.reduce((sum, lap) => sum + lap.lapTime, 0) / lapTimes.length
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}