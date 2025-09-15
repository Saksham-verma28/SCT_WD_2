import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Timer, TrendingUp, Target, BarChart3 } from 'lucide-react';

interface StopwatchStatsProps {
  currentTime: number;
  lapTimes: Array<{ id: number; time: number; lapTime: number }>;
  isRunning: boolean;
}

export function StopwatchStats({ currentTime, lapTimes, isRunning }: StopwatchStatsProps) {
  const formatTime = (milliseconds: number) => {
    const totalMs = Math.floor(milliseconds);
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const ms = Math.floor((totalMs % 1000) / 10);

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }
    return `${seconds}.${ms.toString().padStart(2, '0')}s`;
  };

  const getAveragePace = () => {
    if (lapTimes.length < 2) return 0;
    const totalLapTime = lapTimes.reduce((sum, lap) => sum + lap.lapTime, 0);
    return totalLapTime / lapTimes.length;
  };

  const getBestLap = () => {
    if (lapTimes.length === 0) return 0;
    return Math.min(...lapTimes.map(lap => lap.lapTime));
  };

  const getCurrentLapTime = () => {
    if (lapTimes.length === 0) return currentTime;
    return currentTime - lapTimes[lapTimes.length - 1].time;
  };

  const averagePace = getAveragePace();
  const bestLap = getBestLap();
  const currentLapTime = getCurrentLapTime();
  const progressToMinute = (currentTime % 60000) / 60000 * 100;

  const stats = [
    {
      title: "Current Session",
      value: formatTime(currentTime),
      icon: Timer,
      description: "Total elapsed time",
      trend: isRunning ? "Running" : "Stopped",
      color: "text-primary"
    },
    {
      title: "Current Lap",
      value: formatTime(currentLapTime),
      icon: Target,
      description: "Time since last lap",
      trend: lapTimes.length > 0 ? `Lap ${lapTimes.length + 1}` : "First lap",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Average Pace",
      value: averagePace > 0 ? formatTime(averagePace) : "—",
      icon: TrendingUp,
      description: "Average lap time",
      trend: lapTimes.length > 1 ? `${lapTimes.length} laps` : "Need more laps",
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Best Lap",
      value: bestLap > 0 ? formatTime(bestLap) : "—",
      icon: BarChart3,
      description: "Fastest lap recorded",
      trend: bestLap > 0 ? "Personal best" : "No laps yet",
      color: "text-orange-600 dark:text-orange-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mx-auto">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span>{stat.title}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className={`text-2xl font-mono font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
                <div className="text-xs font-medium text-foreground/70">
                  {stat.trend}
                </div>
              </div>
              
              {/* Progress bar for current session showing progress to next minute */}
              {stat.title === "Current Session" && currentTime > 0 && (
                <div className="pt-2">
                  <Progress 
                    value={progressToMinute} 
                    className="h-1"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.floor(progressToMinute)}% to next minute
                  </div>
                </div>
              )}
              
              {/* Comparison for current lap */}
              {stat.title === "Current Lap" && averagePace > 0 && isRunning && (
                <div className="pt-2">
                  <div className={`text-xs font-medium ${
                    currentLapTime < averagePace ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {currentLapTime < averagePace ? '↗ Faster' : '↘ Slower'} than average
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          {/* Animated border for running state */}
          {isRunning && stat.title === "Current Session" && (
            <div className="absolute inset-0 border-2 border-primary/20 rounded-lg animate-pulse" />
          )}
        </Card>
      ))}
    </div>
  );
}