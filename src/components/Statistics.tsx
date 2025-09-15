import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Clock, Timer, Zap, Target, TrendingUp, Activity } from 'lucide-react';

interface Lap {
  id: number;
  time: number;
  lapTime: number;
  timestamp: Date;
}

interface StatisticsProps {
  totalTime: number;
  laps: Lap[];
  isRunning: boolean;
  sessionStartTime?: Date;
}

export function Statistics({ totalTime, laps, isRunning, sessionStartTime }: StatisticsProps) {
  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const getStatistics = () => {
    if (laps.length === 0) {
      return {
        averageLapTime: 0,
        bestLapTime: 0,
        worstLapTime: 0,
        consistency: 0,
        pace: 0,
        totalLaps: 0
      };
    }

    const lapTimes = laps.map(lap => lap.lapTime);
    const averageLapTime = lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length;
    const bestLapTime = Math.min(...lapTimes);
    const worstLapTime = Math.max(...lapTimes);
    
    // Calculate consistency (lower standard deviation = more consistent)
    const variance = lapTimes.reduce((acc, time) => acc + Math.pow(time - averageLapTime, 2), 0) / lapTimes.length;
    const stdDev = Math.sqrt(variance);
    const consistency = Math.max(0, 100 - (stdDev / averageLapTime) * 100);
    
    // Calculate current pace (last 3 laps average vs overall average)
    const recentLaps = lapTimes.slice(-3);
    const recentAverage = recentLaps.reduce((a, b) => a + b, 0) / recentLaps.length;
    const pace = ((averageLapTime - recentAverage) / averageLapTime) * 100;

    return {
      averageLapTime,
      bestLapTime,
      worstLapTime,
      consistency: Math.round(consistency),
      pace: Math.round(pace),
      totalLaps: laps.length
    };
  };

  const stats = getStatistics();
  const sessionDuration = sessionStartTime ? Date.now() - sessionStartTime.getTime() : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Session Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Session Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Time</span>
            <span className="font-mono">{formatTime(totalTime)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Session Duration</span>
            <span className="font-mono">{formatTime(sessionDuration)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Laps</span>
            <Badge variant="outline">{stats.totalLaps}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={isRunning ? "default" : "secondary"}>
              {isRunning ? "Running" : "Stopped"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.totalLaps > 0 ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Consistency</span>
                  <span className="text-sm">{stats.consistency}%</span>
                </div>
                <Progress value={stats.consistency} className="h-2" />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Best Lap</span>
                <span className="font-mono text-green-600">{formatTime(stats.bestLapTime)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Lap</span>
                <span className="font-mono">{formatTime(stats.averageLapTime)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Pace</span>
                <Badge variant={stats.pace > 0 ? "default" : "destructive"}>
                  {stats.pace > 0 ? "+" : ""}{stats.pace}%
                </Badge>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              <Timer className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Start timing to see performance metrics</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Breakdown */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Time Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.totalLaps > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-mono text-green-600">{formatTime(stats.bestLapTime)}</div>
                <div className="text-sm text-muted-foreground">Best Lap</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-mono">{formatTime(stats.averageLapTime)}</div>
                <div className="text-sm text-muted-foreground">Average</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-mono text-red-600">{formatTime(stats.worstLapTime)}</div>
                <div className="text-sm text-muted-foreground">Worst Lap</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-mono">{stats.totalLaps}</div>
                <div className="text-sm text-muted-foreground">Total Laps</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Complete some laps to see detailed statistics</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}