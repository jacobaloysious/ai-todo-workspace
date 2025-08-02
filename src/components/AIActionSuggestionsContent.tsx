import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  Users,
  ArrowRight
} from 'lucide-react';

interface ActionSuggestion {
  id: string;
  type: 'response' | 'workflow' | 'delegation' | 'schedule';
  title: string;
  description: string;
  confidence: number;
  estimatedTimeSaved: string;
  actionText: string;
}

export const AIActionSuggestionsContent = () => {
  const suggestions: ActionSuggestion[] = [
    {
      id: '1',
      type: 'response',
      title: 'Smart Response for Budget Approval',
      description: 'AI suggests a professional approval response with budget concerns addressed',
      confidence: 92,
      estimatedTimeSaved: '5 min',
      actionText: 'Generate Response'
    },
    {
      id: '2', 
      type: 'workflow',
      title: 'Batch Similar Tasks',
      description: 'Group all document reviews together for better focus and efficiency',
      confidence: 88,
      estimatedTimeSaved: '15 min',
      actionText: 'Create Batch'
    },
    {
      id: '3',
      type: 'delegation',
      title: 'Suggest Delegation',
      description: 'The Jira bug could be handled by Sarah who worked on similar issues',
      confidence: 76,
      estimatedTimeSaved: '3 hours',
      actionText: 'Suggest Delegate'
    },
    {
      id: '4',
      type: 'schedule',
      title: 'Optimal Time Scheduling',
      description: 'Schedule complex tasks during your peak productivity hours (9-11 AM)',
      confidence: 85,
      estimatedTimeSaved: '20 min',
      actionText: 'Auto Schedule'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'response': return MessageSquare;
      case 'workflow': return CheckCircle2;
      case 'delegation': return Users;
      case 'schedule': return Clock;
      default: return MessageSquare;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'response': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'workflow': return 'bg-green-100 text-green-700 border-green-200';
      case 'delegation': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'schedule': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => {
        const IconComponent = getIcon(suggestion.type);
        return (
          <div key={suggestion.id} className="p-4 rounded-lg border border-muted bg-muted/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-ai/10 flex items-center justify-center mt-1">
                <IconComponent className="w-4 h-4 text-ai-primary" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                  </div>
                  <Badge className={getTypeColor(suggestion.type)}>
                    {suggestion.type}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Confidence: {suggestion.confidence}%</span>
                    <span>Saves: {suggestion.estimatedTimeSaved}</span>
                  </div>
                  
                  <Button size="sm" className="bg-gradient-ai hover:opacity-90">
                    {suggestion.actionText}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};