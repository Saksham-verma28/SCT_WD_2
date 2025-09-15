import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Volume2, Moon, Sun, Zap, Download } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: {
    soundEnabled: boolean;
    precision: 'seconds' | 'centiseconds' | 'milliseconds';
    theme: 'light' | 'dark' | 'system';
    autoLap: boolean;
    vibration: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export function SettingsDialog({ open, onOpenChange, settings, onSettingsChange }: SettingsDialogProps) {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const exportSettings = () => {
    const settingsData = {
      ...settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stopwatch-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stopwatch Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Display Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Display</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="flex items-center gap-2">
                {settings.theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                Theme
              </Label>
              <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="precision">Time Precision</Label>
              <Select value={settings.precision} onValueChange={(value) => updateSetting('precision', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="centiseconds">Centiseconds</SelectItem>
                  <SelectItem value="milliseconds">Milliseconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Audio & Feedback */}
          <div className="space-y-4">
            <h3 className="font-medium">Audio & Feedback</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Sound Effects
              </Label>
              <Switch
                id="sound"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="vibration" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Vibration (Mobile)
              </Label>
              <Switch
                id="vibration"
                checked={settings.vibration}
                onCheckedChange={(checked) => updateSetting('vibration', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Advanced Features */}
          <div className="space-y-4">
            <h3 className="font-medium">Advanced</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="autoLap">Auto Lap Every Minute</Label>
              <Switch
                id="autoLap"
                checked={settings.autoLap}
                onCheckedChange={(checked) => updateSetting('autoLap', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Export Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Data</h3>
            
            <Button onClick={exportSettings} variant="outline" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Export Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}