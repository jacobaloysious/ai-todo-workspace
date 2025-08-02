import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Check, 
  Calendar, 
  Target, 
  Tag, 
  MoreHorizontal, 
  Trash2,
  Edit,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  suggestedDueDate?: string;
  keywords: string[];
  createdAt: Date;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const TaskCard = ({ task, onToggleComplete, onDelete, onEdit }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'low': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      work: 'bg-blue-100 text-blue-700 border-blue-200',
      shopping: 'bg-purple-100 text-purple-700 border-purple-200',
      health: 'bg-green-100 text-green-700 border-green-200',
      home: 'bg-orange-100 text-orange-700 border-orange-200',
      general: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card 
      className={`p-4 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass transition-spring hover:shadow-elevated hover:scale-[1.02] ${
        task.completed ? 'opacity-60' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="mt-1 transition-spring data-[state=checked]:bg-gradient-ai data-[state=checked]:border-ai-primary"
        />
        
        <div className="flex-1 space-y-3">
          <p className={`text-sm leading-relaxed transition-smooth ${
            task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}>
            {task.text}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryColor(task.category)}>
              <Tag className="w-3 h-3 mr-1" />
              {task.category}
            </Badge>
            
            <Badge className={getPriorityColor(task.priority)}>
              <Target className="w-3 h-3 mr-1" />
              {task.priority}
            </Badge>
            
            {task.suggestedDueDate && (
              <Badge variant="outline" className="border-ai-accent/30 text-ai-accent">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(task.suggestedDueDate).toLocaleDateString()}
              </Badge>
            )}
          </div>
          
          {task.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs border-muted-foreground/20 text-muted-foreground bg-white/30"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {timeAgo(task.createdAt)}
            </div>
            
            {isHovered && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 opacity-0 animate-in fade-in-0 duration-200"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-sm border-white/20">
                  <DropdownMenuItem onClick={() => onEdit(task.id)} className="cursor-pointer">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)} 
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};