import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Target
} from 'lucide-react';

export const AIWorkloadAnalysisContent = () => {
  const workloadData = {
    totalEstimatedHours: 12.5,
    availableHours: 8,
    overloadPercentage: 56,
    recommendations: [
      {
        type: 'urgent',
        message: 'Consider delegating the Jira bug fix to reduce workload by 3 hours',
        impact: 'High'
      },
      {
        type: 'optimize', 
        message: 'Batch Google Docs reviews to save 30 minutes of context switching',
        impact: 'Medium'
      }
    ],
    trends: {
      thisWeek: 12.5,
      lastWeek: 8.2,
      avgWeek: 9.1
    }
  };

  return (
    <div className="space-y-4">
      {/* Capacity Overview */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">Today's Capacity</span>
          <span className="text-sm text-muted-foreground">
            {workloadData.totalEstimatedHours}h / {workloadData.availableHours}h
          </span>
        </div>
        <Progress 
          value={workloadData.overloadPercentage} 
          className="h-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Available: {workloadData.availableHours}h</span>
          <span className="text-orange-500">Overload: +{workloadData.overloadPercentage}%</span>
        </div>
      </div>

      {/* Trend Comparison */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-sm text-muted-foreground">This Week</div>
          <div className="text-lg font-bold text-foreground">{workloadData.trends.thisWeek}h</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-sm text-muted-foreground">Last Week</div>
          <div className="text-lg font-bold text-foreground">{workloadData.trends.lastWeek}h</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="text-sm text-muted-foreground">Average</div>
          <div className="text-lg font-bold text-foreground">{workloadData.trends.avgWeek}h</div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Target className="w-4 h-4" />
          AI Recommendations
        </h4>
        {workloadData.recommendations.map((rec, index) => (
          <div key={index} className="p-3 rounded-lg bg-muted/30 border border-muted">
            <div className="flex items-start gap-2">
              {rec.type === 'urgent' ? (
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
              ) : (
                <TrendingUp className="w-4 h-4 text-ai-primary mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm text-foreground">{rec.message}</p>
                <Badge 
                  variant="outline" 
                  className={`mt-1 text-xs ${
                    rec.impact === 'High' 
                      ? 'border-orange-200 text-orange-700' 
                      : 'border-ai-accent/30 text-ai-accent'
                  }`}
                >
                  {rec.impact} Impact
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};