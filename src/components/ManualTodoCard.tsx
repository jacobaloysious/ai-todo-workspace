import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Calendar as CalendarIcon, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ManualTodo } from './ManualTodoInput';

interface ManualTodoCardProps {
  todo: ManualTodo;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, updates: Partial<ManualTodo>) => void;
  onDelete: (id: string) => void;
}

const ManualTodoCard: React.FC<ManualTodoCardProps> = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [editScheduledDate, setEditScheduledDate] = useState<Date | undefined>(todo.scheduledDate);

  const handleSave = () => {
    onEdit(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      scheduledDate: editScheduledDate,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditScheduledDate(todo.scheduledDate);
    setIsEditing(false);
  };

  const isOverdue = todo.scheduledDate && new Date(todo.scheduledDate) < new Date() && !todo.completed;
  const isToday = todo.scheduledDate && format(todo.scheduledDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  if (isEditing) {
    return (
      <Card className="p-4 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="bg-background/50 border-white/20"
            placeholder="Todo title..."
          />
          
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="bg-background/50 border-white/20 min-h-[60px]"
            placeholder="Description..."
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal bg-background/50 border-white/20",
                  !editScheduledDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {editScheduledDate ? format(editScheduledDate, "PPP") : "Schedule date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={editScheduledDate}
                onSelect={setEditScheduledDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={!editTitle.trim()}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "p-4 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass hover:shadow-elevated transition-spring",
      todo.completed && "opacity-75"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggleComplete(todo.id)}
          className="mt-0.5"
        />
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className={cn(
                "text-base font-medium text-foreground",
                todo.completed && "line-through text-muted-foreground"
              )}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={cn(
                  "text-sm text-muted-foreground",
                  todo.completed && "line-through"
                )}>
                  {todo.description}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(todo.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2">
            {todo.completed && (
              <Badge variant="outline" className="border-green-500/30 text-green-600">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
            
            {todo.scheduledDate && (
              <Badge 
                variant="outline" 
                className={cn(
                  "border-ai-accent/30 text-ai-accent",
                  isOverdue && "border-red-500/30 text-red-600",
                  isToday && "border-orange-500/30 text-orange-600"
                )}
              >
                <CalendarIcon className="w-3 h-3 mr-1" />
                {isToday ? 'Today' : format(todo.scheduledDate, 'MMM d')}
                {isOverdue && ' (Overdue)'}
              </Badge>
            )}
            
            <Badge variant="outline" className="border-muted text-muted-foreground text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Created {format(todo.createdAt, 'MMM d')}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ManualTodoCard;