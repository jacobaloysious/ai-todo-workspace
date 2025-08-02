import { useState, useEffect } from 'react';
import { TaskInput } from '@/components/TaskInput';
import { TaskCard } from '@/components/TaskCard';
import { AIInsights } from '@/components/AIInsights';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Filter, CheckCircle, Clock, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

type FilterType = 'all' | 'pending' | 'completed' | 'high-priority';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const { toast } = useToast();

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('ai-todo-tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('ai-todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: {
    text: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    suggestedDueDate?: string;
    keywords: string[];
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskData.text,
      completed: false,
      category: taskData.category,
      priority: taskData.priority,
      suggestedDueDate: taskData.suggestedDueDate,
      keywords: taskData.keywords,
      createdAt: new Date()
    };

    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "Task has been removed from your list",
    });
  };

  const editTask = (id: string) => {
    // For this version, we'll just show a toast
    toast({
      title: "Edit Feature",
      description: "Task editing will be available in the next update!",
    });
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'high-priority':
        return tasks.filter(task => task.priority === 'high' && !task.completed);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const pendingCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;
  const highPriorityCount = tasks.filter(task => task.priority === 'high' && !task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-ai-primary" />
            <h1 className="text-4xl font-bold bg-gradient-ai bg-clip-text text-transparent">
              AI Todo
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience intelligent task management with AI-powered insights, smart categorization, and natural language processing.
          </p>
        </div>

        {/* Task Input */}
        <div className="mb-8">
          <TaskInput onAddTask={addTask} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Task List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 p-4 bg-gradient-card backdrop-blur-sm rounded-xl border border-white/20 shadow-glass">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-gradient-ai' : 'bg-white/50 hover:bg-white/70'}
              >
                <Filter className="w-4 h-4 mr-2" />
                All ({tasks.length})
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
                className={filter === 'pending' ? 'bg-gradient-ai' : 'bg-white/50 hover:bg-white/70'}
              >
                <Clock className="w-4 h-4 mr-2" />
                Pending ({pendingCount})
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('completed')}
                className={filter === 'completed' ? 'bg-gradient-ai' : 'bg-white/50 hover:bg-white/70'}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed ({completedCount})
              </Button>
              <Button
                variant={filter === 'high-priority' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('high-priority')}
                className={filter === 'high-priority' ? 'bg-gradient-ai' : 'bg-white/50 hover:bg-white/70'}
              >
                <Target className="w-4 h-4 mr-2" />
                High Priority ({highPriorityCount})
              </Button>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-ai/10 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-ai-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {filter === 'all' ? 'No tasks yet' : `No ${filter.replace('-', ' ')} tasks`}
                  </h3>
                  <p className="text-muted-foreground">
                    {filter === 'all' 
                      ? 'Start by adding your first task using natural language above!'
                      : 'Try switching to a different filter or add new tasks.'
                    }
                  </p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleTaskComplete}
                    onDelete={deleteTask}
                    onEdit={editTask}
                  />
                ))
              )}
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="lg:col-span-1">
            <AIInsights tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
