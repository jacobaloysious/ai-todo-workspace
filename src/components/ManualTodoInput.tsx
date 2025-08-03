import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';

export interface ManualTodo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  scheduledDate?: Date;
  createdAt: Date;
}

interface ManualTodoInputProps {
  onAddTodo: (todo: Omit<ManualTodo, 'id' | 'createdAt'>) => void;
}

const ManualTodoInput: React.FC<ManualTodoInputProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTodo({
      title: title.trim(),
      description: description.trim(),
      completed: false,
      scheduledDate,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setScheduledDate(undefined);
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setScheduledDate(undefined);
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Card className="p-4 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          className="w-full justify-start text-muted-foreground border-dashed border-white/30 hover:border-white/50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create a new todo
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Todo title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background/50 border-white/20"
            autoFocus
          />
        </div>

        <div>
          <Textarea
            placeholder="Description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background/50 border-white/20 min-h-[80px]"
          />
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal bg-background/50 border-white/20",
                  !scheduledDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {scheduledDate ? format(scheduledDate, "PPP") : "Schedule date (optional)"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={scheduledDate}
                onSelect={setScheduledDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={!title.trim()}>
            Create Todo
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ManualTodoInput;