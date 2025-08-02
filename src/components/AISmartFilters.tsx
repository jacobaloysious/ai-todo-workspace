import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Sparkles, 
  Zap, 
  Trophy, 
  Clock, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';

export const AISmartFilters = () => {
  const smartFilters = [
    {
      id: 'quick-wins',
      name: 'Quick Wins',
      icon: Zap,
      count: 3,
      description: 'Low effort, high impact tasks',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      id: 'high-impact',
      name: 'High Impact',
      icon: Trophy,
      count: 2,
      description: 'Critical tasks affecting business goals',
      color: 'bg-gradient-to-r from-purple-500 to-blue-500'
    },
    {
      id: 'overdue-risk',
      name: 'Overdue Risk',
      icon: AlertCircle,
      count: 1,
      description: 'Tasks approaching or past deadline',
      color: 'bg-gradient-to-r from-red-500 to-pink-500'
    },
    {
      id: 'momentum',
      name: 'Build Momentum',
      icon: TrendingUp,
      count: 4,
      description: 'Easy tasks to get started',
      color: 'bg-gradient-to-r from-orange-500 to-yellow-500'
    },
    {
      id: 'focus-time',
      name: 'Focus Time Needed',
      icon: Clock,
      count: 2,
      description: 'Complex tasks requiring deep work',
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500'
    }
  ];

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-ai/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-ai-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Smart Filters</h3>
          <p className="text-sm text-muted-foreground">Intelligent task categorization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {smartFilters.map((filter) => {
          const IconComponent = filter.icon;
          return (
            <Button
              key={filter.id}
              variant="outline"
              className="h-auto p-4 justify-start text-left hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-start gap-3 w-full">
                <div className={`w-8 h-8 rounded-lg ${filter.color} flex items-center justify-center text-white`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground text-sm">{filter.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {filter.count}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {filter.description}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};