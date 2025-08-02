import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

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

interface AIInsightsProps {
  tasks: Task[];
}

export const AIInsights = ({ tasks }: AIInsightsProps) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Category analysis
  const categoryStats = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryStats).sort(([,a], [,b]) => b - a)[0];

  // Priority analysis
  const priorityStats = tasks.reduce((acc, task) => {
    if (!task.completed) {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const highPriorityCount = priorityStats.high || 0;
  const mediumPriorityCount = priorityStats.medium || 0;
  const lowPriorityCount = priorityStats.low || 0;

  // Overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.suggestedDueDate || task.completed) return false;
    return new Date(task.suggestedDueDate) < new Date();
  }).length;

  // Productivity insights
  const getProductivityInsight = () => {
    if (completionRate >= 80) return "Excellent productivity! You're crushing your goals! 🚀";
    if (completionRate >= 60) return "Good progress! Keep up the momentum! 💪";
    if (completionRate >= 40) return "Steady progress. Consider focusing on high-priority tasks! 🎯";
    if (completionRate >= 20) return "Let's get started! Break down larger tasks for easier completion! 📝";
    return "Time to take action! Start with one small task to build momentum! ⚡";
  };

  const getRecommendation = () => {
    if (highPriorityCount > 3) return "Focus on high-priority tasks first to maximize impact.";
    if (overdueTasks > 0) return `You have ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}. Consider addressing them today.`;
    if (topCategory && categoryStats[topCategory[0]] > totalTasks * 0.5) {
      return `Most of your tasks are ${topCategory[0]}-related. Consider time-blocking for better focus.`;
    }
    return "Great job maintaining a balanced task list! Keep up the good work.";
  };

  if (totalTasks === 0) {
    return (
      <Card className="p-6 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
        <div className="text-center space-y-4">
          <Brain className="w-12 h-12 mx-auto text-ai-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
          <p className="text-muted-foreground">Add some tasks to see intelligent insights about your productivity!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-ai-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
        </div>
        
        <div className="space-y-6">
          {/* Completion Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Completion Rate</span>
              <span className="text-muted-foreground">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <p className="text-xs text-muted-foreground">{completedTasks} of {totalTasks} tasks completed</p>
          </div>

          {/* Priority Overview */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Priority Overview
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-lg bg-red-50 border border-red-200">
                <div className="text-lg font-bold text-red-700">{highPriorityCount}</div>
                <div className="text-xs text-red-600">High</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="text-lg font-bold text-yellow-700">{mediumPriorityCount}</div>
                <div className="text-xs text-yellow-600">Medium</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-green-50 border border-green-200">
                <div className="text-lg font-bold text-green-700">{lowPriorityCount}</div>
                <div className="text-xs text-green-600">Low</div>
              </div>
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/30 backdrop-blur-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-sm font-medium text-foreground">{completedTasks}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/30 backdrop-blur-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium text-foreground">{pendingTasks}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
          </div>

          {overdueTasks > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <div>
                <div className="text-sm font-medium text-red-700">{overdueTasks}</div>
                <div className="text-xs text-red-600">Overdue</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Insights & Recommendations */}
      <Card className="p-6 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-ai-primary" />
          <h3 className="text-lg font-semibold text-foreground">Smart Recommendations</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-ai-primary/5 border border-ai-primary/20">
            <h4 className="text-sm font-medium text-foreground mb-1">Productivity Insight</h4>
            <p className="text-sm text-muted-foreground">{getProductivityInsight()}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-ai-secondary/5 border border-ai-secondary/20">
            <h4 className="text-sm font-medium text-foreground mb-1">Recommendation</h4>
            <p className="text-sm text-muted-foreground">{getRecommendation()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};