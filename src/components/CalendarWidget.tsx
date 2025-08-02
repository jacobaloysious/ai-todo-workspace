import React, { useState } from 'react';
import { format, addHours, startOfDay, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CalendarIcon,
  Clock,
  Plus,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduledItem {
  id: string;
  actionItemId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  priority: 'high' | 'medium' | 'low';
  source: 'google-docs' | 'jira' | 'concur' | 'interviewing';
  estimatedTime: string;
}

interface ActionItem {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  source: 'google-docs' | 'jira' | 'concur' | 'interviewing';
  estimatedTime?: string;
}

interface CalendarWidgetProps {
  actionItems: ActionItem[];
  onScheduleItem?: (scheduleData: Omit<ScheduledItem, 'id'>) => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ 
  actionItems, 
  onScheduleItem 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([
    {
      id: '1',
      actionItemId: '1',
      title: 'Review Q4 Budget Planning Document',
      startTime: new Date(2024, 7, 2, 9, 0), // Aug 2, 9:00 AM
      endTime: new Date(2024, 7, 2, 10, 0), // Aug 2, 10:00 AM
      priority: 'high',
      source: 'google-docs',
      estimatedTime: '45 min'
    },
    {
      id: '2',
      actionItemId: '2',
      title: 'Fix authentication bug',
      startTime: new Date(2024, 7, 2, 14, 0), // Aug 2, 2:00 PM
      endTime: new Date(2024, 7, 2, 17, 0), // Aug 2, 5:00 PM
      priority: 'high',
      source: 'jira',
      estimatedTime: '3 hours'
    }
  ]);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedActionItem, setSelectedActionItem] = useState<ActionItem | null>(null);
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [scheduleDuration, setScheduleDuration] = useState('1');

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const durationOptions = [
    { value: '0.5', label: '30 minutes' },
    { value: '1', label: '1 hour' },
    { value: '1.5', label: '1.5 hours' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours' }
  ];

  const getScheduledItemsForDate = (date: Date) => {
    return scheduledItems.filter(item => isSameDay(item.startTime, date));
  };

  const handleScheduleItem = () => {
    if (!selectedActionItem) return;

    const [hours, minutes] = scheduleTime.split(':').map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = addHours(startTime, parseFloat(scheduleDuration));

    const newScheduledItem: ScheduledItem = {
      id: Date.now().toString(),
      actionItemId: selectedActionItem.id,
      title: selectedActionItem.title,
      startTime,
      endTime,
      priority: selectedActionItem.priority,
      source: selectedActionItem.source,
      estimatedTime: selectedActionItem.estimatedTime || `${scheduleDuration} hour${parseFloat(scheduleDuration) !== 1 ? 's' : ''}`
    };

    setScheduledItems(prev => [...prev, newScheduledItem]);
    onScheduleItem?.(newScheduledItem);
    setIsScheduleDialogOpen(false);
    setSelectedActionItem(null);
  };

  const removeScheduledItem = (itemId: string) => {
    setScheduledItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50/50';
      case 'low': return 'border-l-green-500 bg-green-50/50';
      default: return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'google-docs': return '📄';
      case 'jira': return '🔧';
      case 'concur': return '💳';
      case 'interviewing': return '👥';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">{/* Changed from grid to vertical stacking */}
      {/* Calendar */}
      <Card className="p-4 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-base font-semibold text-foreground">Calendar</h3>
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-ai hover:opacity-90 text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule Action Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="action-item">Action Item</Label>
                  <Select
                    value={selectedActionItem?.id || ''}
                    onValueChange={(value) => {
                      const item = actionItems.find(item => item.id === value);
                      setSelectedActionItem(item || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an action item" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <div className="flex items-center gap-2">
                            <span>{getSourceIcon(item.source)}</span>
                            <span className="truncate">{item.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="schedule-date">Date</Label>
                  <div className="text-sm text-muted-foreground">
                    {format(selectedDate, 'PPPP')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schedule-time">Start Time</Label>
                    <Select value={scheduleTime} onValueChange={setScheduleTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="schedule-duration">Duration</Label>
                    <Select value={scheduleDuration} onValueChange={setScheduleDuration}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsScheduleDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleScheduleItem}
                    disabled={!selectedActionItem}
                    className="bg-gradient-ai hover:opacity-90"
                  >
                    Schedule
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className={cn("rounded-md border border-white/20 pointer-events-auto")}
          modifiers={{
            hasEvents: (date) => getScheduledItemsForDate(date).length > 0
          }}
          modifiersClassNames={{
            hasEvents: "bg-gradient-ai/20 text-ai-primary font-semibold"
          }}
        />
      </Card>

      {/* Scheduled Items for Selected Date */}
      <Card className="p-4 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
        <div className="flex items-center gap-2 mb-3">
          <CalendarIcon className="w-4 h-4 text-ai-primary" />
          <h3 className="text-base font-semibold text-foreground">
            {format(selectedDate, 'MMM d')}
          </h3>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {getScheduledItemsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-6">
                <Clock className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">No scheduled items</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsScheduleDialogOpen(true)}
                >
                  Schedule task
                </Button>
              </div>
            ) : (
              getScheduledItemsForDate(selectedDate)
                .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
                .map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border-l-4 ${getPriorityColor(item.priority)} relative group`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{getSourceIcon(item.source)}</span>
                          <h4 className="font-medium text-foreground text-xs truncate">{item.title}</h4>
                        </div>
                        
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(item.startTime, 'h:mm a')} - {format(item.endTime, 'h:mm a')}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.estimatedTime}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                item.priority === 'high' ? 'border-red-200 text-red-700' :
                                item.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                                'border-green-200 text-green-700'
                              }`}
                            >
                              {item.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        onClick={() => removeScheduledItem(item.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </ScrollArea>

        {/* Quick Stats */}
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">
              {getScheduledItemsForDate(selectedDate).length} scheduled
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-ai-primary" />
            <span className="text-muted-foreground">
              {getScheduledItemsForDate(selectedDate).filter(item => item.priority === 'high').length} high priority
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};