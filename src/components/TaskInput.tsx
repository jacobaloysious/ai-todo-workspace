import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus, Calendar, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIAnalysis {
  category: string;
  priority: 'low' | 'medium' | 'high';
  suggestedDueDate?: string;
  extractedKeywords: string[];
}

interface TaskInputProps {
  onAddTask: (task: {
    text: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    suggestedDueDate?: string;
    keywords: string[];
  }) => void;
}

export const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const { toast } = useToast();

  const simulateAIAnalysis = (text: string): AIAnalysis => {
    // Simulate AI analysis with realistic patterns
    const keywords = text.toLowerCase().split(' ').filter(word => word.length > 3);
    
    let category = 'general';
    let priority: 'low' | 'medium' | 'high' = 'medium';
    
    // Category detection
    if (text.toLowerCase().includes('work') || text.toLowerCase().includes('meeting') || text.toLowerCase().includes('project')) {
      category = 'work';
    } else if (text.toLowerCase().includes('buy') || text.toLowerCase().includes('shop') || text.toLowerCase().includes('grocery')) {
      category = 'shopping';
    } else if (text.toLowerCase().includes('doctor') || text.toLowerCase().includes('health') || text.toLowerCase().includes('exercise')) {
      category = 'health';
    } else if (text.toLowerCase().includes('clean') || text.toLowerCase().includes('home') || text.toLowerCase().includes('house')) {
      category = 'home';
    }
    
    // Priority detection
    if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('asap') || text.toLowerCase().includes('important')) {
      priority = 'high';
    } else if (text.toLowerCase().includes('sometime') || text.toLowerCase().includes('when free') || text.toLowerCase().includes('eventually')) {
      priority = 'low';
    }
    
    // Due date suggestion
    let suggestedDueDate;
    if (text.toLowerCase().includes('today')) {
      suggestedDueDate = new Date().toISOString().split('T')[0];
    } else if (text.toLowerCase().includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      suggestedDueDate = tomorrow.toISOString().split('T')[0];
    } else if (text.toLowerCase().includes('weekend')) {
      const nextSaturday = new Date();
      nextSaturday.setDate(nextSaturday.getDate() + (6 - nextSaturday.getDay()));
      suggestedDueDate = nextSaturday.toISOString().split('T')[0];
    }
    
    return {
      category,
      priority,
      suggestedDueDate,
      extractedKeywords: keywords.slice(0, 3)
    };
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const analysis = simulateAIAnalysis(input);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
    
    toast({
      title: "AI Analysis Complete",
      description: `Detected category: ${analysis.category}, Priority: ${analysis.priority}`,
    });
  };

  const handleAddTask = () => {
    if (!input.trim()) return;
    
    const analysis = aiAnalysis || simulateAIAnalysis(input);
    
    onAddTask({
      text: input,
      category: analysis.category,
      priority: analysis.priority,
      suggestedDueDate: analysis.suggestedDueDate,
      keywords: analysis.extractedKeywords
    });
    
    setInput('');
    setAiAnalysis(null);
    
    toast({
      title: "Task Added",
      description: "Your task has been added with AI suggestions",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (aiAnalysis) {
        handleAddTask();
      } else {
        handleAnalyze();
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'low': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-card backdrop-blur-sm rounded-2xl shadow-glass border border-white/20">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your task in natural language..."
            className="flex-1 bg-white/50 backdrop-blur-sm border-white/30 placeholder:text-muted-foreground/70 transition-smooth focus:bg-white/70"
          />
          {!aiAnalysis ? (
            <Button
              onClick={handleAnalyze}
              disabled={!input.trim() || isAnalyzing}
              className="bg-gradient-ai hover:shadow-elevated transition-spring"
            >
              {isAnalyzing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </Button>
          ) : (
            <Button
              onClick={handleAddTask}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-elevated transition-spring"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {aiAnalysis && (
          <div className="space-y-3 p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
              <Sparkles className="w-4 h-4 text-ai-primary" />
              AI Analysis
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {aiAnalysis.category}
              </Badge>
              <Badge className={getPriorityColor(aiAnalysis.priority)}>
                <Target className="w-3 h-3 mr-1" />
                {aiAnalysis.priority} priority
              </Badge>
              {aiAnalysis.suggestedDueDate && (
                <Badge variant="outline" className="border-ai-accent/30 text-ai-accent">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(aiAnalysis.suggestedDueDate).toLocaleDateString()}
                </Badge>
              )}
            </div>
            
            {aiAnalysis.extractedKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {aiAnalysis.extractedKeywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-muted-foreground/20 text-muted-foreground">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};