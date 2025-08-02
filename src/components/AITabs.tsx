import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIWorkloadAnalysisContent } from './AIWorkloadAnalysisContent';
import { AISmartFiltersContent } from './AISmartFiltersContent';
import { AIActionSuggestionsContent } from './AIActionSuggestionsContent';
import { 
  Brain, 
  Sparkles, 
  Lightbulb
} from 'lucide-react';

export const AITabs = () => {
  const [activeTab, setActiveTab] = useState<'workload' | 'filters' | 'suggestions'>('workload');

  const tabs = [
    {
      id: 'workload',
      name: 'AI Workload Analysis',
      icon: Brain,
      description: 'Capacity planning'
    },
    {
      id: 'filters',
      name: 'AI Smart Filters',
      icon: Sparkles,
      description: 'Task categorization'
    },
    {
      id: 'suggestions',
      name: 'AI Action Suggestions',
      icon: Lightbulb,
      description: 'Workflow optimization'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'workload':
        return (
          <Card className="p-6 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
            <AIWorkloadAnalysisContent />
          </Card>
        );
      case 'filters':
        return (
          <Card className="p-6 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
            <AISmartFiltersContent />
          </Card>
        );
      case 'suggestions':
        return (
          <Card className="p-6 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
            <AIActionSuggestionsContent />
          </Card>
        );
      default:
        return (
          <Card className="p-6 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
            <AIWorkloadAnalysisContent />
          </Card>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Headers */}
      <div className="flex flex-col sm:flex-row gap-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "outline"}
              className={`flex-1 h-auto p-4 justify-start text-left transition-all ${
                isActive 
                  ? 'bg-gradient-ai text-white shadow-elevated' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gradient-ai/10 text-ai-primary'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{tab.name}</div>
                  <div className={`text-xs ${
                    isActive ? 'text-white/80' : 'text-muted-foreground'
                  }`}>
                    {tab.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {renderTabContent()}
      </div>
    </div>
  );
};