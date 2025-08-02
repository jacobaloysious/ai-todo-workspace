import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIWorkloadAnalysis } from '@/components/AIWorkloadAnalysis';
import { AISmartFilters } from '@/components/AISmartFilters';
import { AIActionSuggestions } from '@/components/AIActionSuggestions';
import { AITabs } from '@/components/AITabs';
import { ChatInterface } from '@/components/ChatInterface';
import { CalendarWidget } from '@/components/CalendarWidget';
import { 
  FileText, 
  Bug, 
  CreditCard, 
  ExternalLink, 
  MessageSquare, 
  Calendar,
  CalendarIcon,
  AlertCircle,
  CheckCircle2,
  Brain,
  Zap,
  Clock,
  Users
} from 'lucide-react';

interface ActionItem {
  id: string;
  title: string;
  source: 'google-docs' | 'jira' | 'concur' | 'interviewing';
  type: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  description: string;
  actionRequired: string;
  link: string;
  assignedBy?: string;
  created: string;
  aiScore?: number;
  estimatedTime?: string;
  sentiment?: 'urgent' | 'neutral' | 'friendly';
  aiSuggestion?: string;
  dependencies?: string[];
}

const ActionItems = () => {
  const [selectedSource, setSelectedSource] = useState<string>('all');
  // Mock data for demonstration with AI enhancements
  const actionItems: ActionItem[] = [
    {
      id: '1',
      title: 'Review Q4 Budget Planning Document',
      source: 'google-docs',
      type: 'Comment',
      priority: 'high',
      dueDate: '2024-08-05',
      description: 'Please review the Q4 budget allocations for the marketing department and provide feedback on the proposed increases.',
      actionRequired: 'Review and comment',
      link: 'https://docs.google.com/document/d/...',
      assignedBy: 'Sarah Johnson',
      created: '2024-08-01',
      aiScore: 95,
      estimatedTime: '45 min',
      sentiment: 'neutral',
      aiSuggestion: 'Focus on marketing ROI metrics in sections 3-4',
      dependencies: ['Q3 Performance Review']
    },
    {
      id: '2',
      title: 'Fix authentication bug in user registration',
      source: 'jira',
      type: 'Bug',
      priority: 'high',
      dueDate: '2024-08-04',
      description: 'Users are unable to register with email addresses containing special characters. This is blocking new user onboarding.',
      actionRequired: 'Fix and test',
      link: 'https://yourcompany.atlassian.net/browse/AUTH-123',
      assignedBy: 'System',
      created: '2024-07-30',
      aiScore: 92,
      estimatedTime: '3 hours',
      sentiment: 'urgent',
      aiSuggestion: 'Similar issue resolved in AUTH-98, check validation regex',
      dependencies: ['User Registration Service']
    },
    {
      id: '3',
      title: 'Approve expense report - Conference travel',
      source: 'concur',
      type: 'Expense Approval',
      priority: 'medium',
      dueDate: '2024-08-06',
      description: 'Expense report for attendance at TechConf 2024 including flights, hotel, and meals totaling $2,847.50',
      actionRequired: 'Approve or reject',
      link: 'https://concur.company.com/expense/...',
      assignedBy: 'Mike Chen',
      created: '2024-08-01',
      aiScore: 78,
      estimatedTime: '5 min',
      sentiment: 'friendly',
      aiSuggestion: 'All receipts attached, within policy limits',
      dependencies: []
    },
    {
      id: '4',
      title: 'Marketing Strategy 2025 - Need input on digital channels',
      source: 'google-docs',
      type: 'Comment',
      priority: 'medium',
      description: 'Your expertise in digital marketing would be valuable for this section. Please add your thoughts on the proposed social media strategy.',
      actionRequired: 'Provide input',
      link: 'https://docs.google.com/document/d/...',
      assignedBy: 'Lisa Wang',
      created: '2024-07-29',
      aiScore: 85,
      estimatedTime: '30 min',
      sentiment: 'friendly',
      aiSuggestion: 'Consider TikTok and LinkedIn strategy gaps',
      dependencies: ['Q4 Budget Document']
    },
    {
      id: '5',
      title: 'Implement user dashboard analytics',
      source: 'jira',
      type: 'Story',
      priority: 'medium',
      description: 'Create analytics dashboard showing user engagement metrics, page views, and conversion rates.',
      actionRequired: 'Develop feature',
      link: 'https://yourcompany.atlassian.net/browse/DASH-456',
      assignedBy: 'Product Team',
      created: '2024-07-28',
      aiScore: 72,
      estimatedTime: '8 hours',
      sentiment: 'neutral',
      aiSuggestion: 'Break into smaller tasks: metrics API, UI components',
      dependencies: ['Authentication System', 'Database Schema']
    },
    {
      id: '6',
      title: 'Approve team building event budget',
      source: 'concur',
      type: 'Budget Approval',
      priority: 'low',
      dueDate: '2024-08-10',
      description: 'Requesting approval for quarterly team building event budget of $1,200 for team dinner and activities.',
      actionRequired: 'Approve budget',
      link: 'https://concur.company.com/request/...',
      assignedBy: 'HR Department',
      created: '2024-07-31',
      aiScore: 45,
      estimatedTime: '2 min',
      sentiment: 'friendly',
      aiSuggestion: 'Within quarterly budget allocation',
      dependencies: []
    },
    {
      id: '7',
      title: 'Submit Interview Feedback - Senior Developer Position',
      source: 'interviewing',
      type: 'Interview Feedback',
      priority: 'high',
      dueDate: '2024-08-02', // 6 hours SLA
      description: 'Provide detailed feedback for John Smith\'s technical interview for Senior Developer role. Include assessment of coding skills, problem-solving approach, and cultural fit.',
      actionRequired: 'Submit feedback',
      link: 'https://hr.company.com/interview-feedback/...',
      assignedBy: 'HR Department',
      created: '2024-08-02',
      aiScore: 88,
      estimatedTime: '20 min',
      sentiment: 'neutral',
      aiSuggestion: 'Focus on technical competency and team collaboration aspects',
      dependencies: ['Interview Completion']
    },
    {
      id: '8',
      title: 'Respond to Panel Interview Invitation - Product Manager Role',
      source: 'interviewing',
      type: 'Interview Invitation',
      priority: 'medium',
      dueDate: '2024-08-03', // 24 hours SLA
      description: 'Accept or decline invitation to participate as a panel interviewer for Product Manager position. Interview scheduled for August 8th, 2:00-3:30 PM.',
      actionRequired: 'Accept or decline',
      link: 'https://hr.company.com/interview-invite/...',
      assignedBy: 'Sarah Johnson',
      created: '2024-08-02',
      aiScore: 65,
      estimatedTime: '2 min',
      sentiment: 'friendly',
      aiSuggestion: 'Check calendar availability for Aug 8th afternoon',
      dependencies: []
    }
  ];

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'google-docs': return <FileText className="w-4 h-4" />;
      case 'jira': return <Bug className="w-4 h-4" />;
      case 'concur': return <CreditCard className="w-4 h-4" />;
      case 'interviewing': return <Users className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'google-docs': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'jira': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'concur': return 'bg-green-100 text-green-700 border-green-200';
      case 'interviewing': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSourceName = (source: string) => {
    switch (source) {
      case 'google-docs': return 'Google Docs';
      case 'jira': return 'Jira';
      case 'concur': return 'Concur';
      case 'interviewing': return 'Recruiting';
      default: return source;
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

  const groupedItems = actionItems.reduce((acc, item) => {
    if (!acc[item.source]) acc[item.source] = [];
    acc[item.source].push(item);
    return acc;
  }, {} as Record<string, ActionItem[]>);

  // Filter based on selected source
  const filteredGroupedItems = selectedSource === 'all' 
    ? groupedItems 
    : { [selectedSource]: groupedItems[selectedSource] || [] };

  const filteredActionItems = selectedSource === 'all' 
    ? actionItems 
    : actionItems.filter(item => item.source === selectedSource);

  const totalItems = filteredActionItems.length;
  const highPriorityItems = filteredActionItems.filter(item => item.priority === 'high').length;
  const overdueItems = filteredActionItems.filter(item => 
    item.dueDate && new Date(item.dueDate) < new Date()
  ).length;

  const handleLayoutUpdate = (prompt: string) => {
    console.log('Layout update requested:', prompt);
    // Here you would implement the actual layout changes
    // For now, we'll just log the prompt
  };

  const handleScheduleItem = (scheduleData: any) => {
    console.log('Item scheduled:', scheduleData);
    // Here you would implement the actual scheduling logic
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-ai bg-clip-text text-transparent mb-2">
            AI Workspace
          </h1>
          <p className="text-lg text-muted-foreground">
            Tasks and approvals waiting for your attention across all platforms
          </p>
        </div>

        {/* AI Features Section */}
        <div className="mb-8">
          <AITabs />
        </div>

        {/* Summary Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Source Filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-foreground whitespace-nowrap">Filter by:</label>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-[180px] bg-background/50 border-white/20">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/20">
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="google-docs">Google Docs</SelectItem>
                <SelectItem value="jira">Jira</SelectItem>
                <SelectItem value="concur">Concur</SelectItem>
                <SelectItem value="interviewing">Recruiting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            <Card className="p-4 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-ai/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-ai-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalItems}</p>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{highPriorityItems}</p>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{overdueItems}</p>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{Object.keys(filteredGroupedItems).length}</p>
                  <p className="text-sm text-muted-foreground">Sources</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content: Action Items + Calendar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Action Items - Left Side (2/3 width) */}
          <div className="xl:col-span-2 space-y-8">
            {Object.entries(filteredGroupedItems).length === 0 ? (
              <Card className="p-8 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No items found</h3>
                <p className="text-muted-foreground">
                  No action items found for the selected filter.
                </p>
              </Card>
            ) : (
              Object.entries(filteredGroupedItems).map(([source, items]) => (
            <div key={source}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {getSourceIcon(source)}
                  <h2 className="text-2xl font-semibold text-foreground">
                    {getSourceName(source)}
                  </h2>
                </div>
                <Badge className={getSourceColor(source)}>
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid gap-4">
                {items.map((item) => (
                  <Card 
                    key={item.id}
                    className="p-6 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass hover:shadow-elevated transition-spring hover:scale-[1.01]"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          {item.aiScore && (
                            <Badge variant="outline" className="border-ai-primary/30 text-ai-primary">
                              <Brain className="w-3 h-3 mr-1" />
                              AI Score: {item.aiScore}
                            </Badge>
                          )}
                          {item.estimatedTime && (
                            <Badge variant="outline" className="border-muted text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {item.estimatedTime}
                            </Badge>
                          )}
                          {item.dueDate && (
                            <Badge variant="outline" className="border-ai-accent/30 text-ai-accent">
                              <Calendar className="w-3 h-3 mr-1" />
                              Due {new Date(item.dueDate).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                        
                        {item.aiSuggestion && (
                          <div className="p-3 rounded-lg bg-gradient-ai/5 border border-ai-primary/20">
                            <div className="flex items-start gap-2">
                              <Zap className="w-4 h-4 text-ai-primary mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-ai-primary">AI Insight</p>
                                <p className="text-sm text-muted-foreground">{item.aiSuggestion}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {item.type}
                          </div>
                          {item.assignedBy && (
                            <div>
                              Assigned by: <span className="font-medium">{item.assignedBy}</span>
                            </div>
                          )}
                          <div>
                            Created: {new Date(item.created).toLocaleDateString()}
                          </div>
                          {item.sentiment && (
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${
                                item.sentiment === 'urgent' ? 'bg-red-500' :
                                item.sentiment === 'friendly' ? 'bg-green-500' : 'bg-gray-500'
                              }`} />
                              <span className="capitalize">{item.sentiment} tone</span>
                            </div>
                          )}
                          {item.dependencies && item.dependencies.length > 0 && (
                            <div>
                              Dependencies: <span className="font-medium">{item.dependencies.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Separator orientation="vertical" className="hidden lg:block h-24" />
                      
                      <div className="lg:w-48 space-y-3">
                        <div className="text-sm">
                          <p className="font-medium text-foreground mb-1">Action Required:</p>
                          <p className="text-muted-foreground">{item.actionRequired}</p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm" 
                            className="bg-gradient-ai hover:opacity-90 w-full"
                            onClick={() => window.open(item.link, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open in {getSourceName(item.source)}
                          </Button>
                          
                          {item.source === 'concur' && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                Reject
                              </Button>
                            </div>
                          )}
                          
                          {item.source === 'jira' && (
                            <Button variant="outline" size="sm" className="w-full">
                              Start Work
                            </Button>
                          )}
                          
                          {item.source === 'google-docs' && (
                            <Button variant="outline" size="sm" className="w-full">
                              Add Comment
                            </Button>
                          )}

                          {item.source === 'interviewing' && (
                            <div className="space-y-2">
                              {item.type === 'Interview Feedback' && (
                                <Button variant="outline" size="sm" className="w-full">
                                  Submit Feedback
                                </Button>
                              )}
                              {item.type === 'Interview Invitation' && (
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="flex-1">
                                    Accept
                                  </Button>
                                  <Button variant="outline" size="sm" className="flex-1">
                                    Decline
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}

                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              // This would trigger the calendar widget scheduling
                              console.log('Schedule item:', item.id);
                            }}
                          >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
              ))
            )}
          </div>

          {/* Calendar Widget - Right Side (1/3 width) */}
          <div className="xl:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">Schedule & Calendar</h2>
              <CalendarWidget 
                actionItems={filteredActionItems}
                onScheduleItem={handleScheduleItem}
              />
            </div>
          </div>
        </div>

        {/* Empty State */}
        {totalItems === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-ai/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-ai-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">All caught up!</h3>
            <p className="text-muted-foreground">
              No action items waiting for your attention right now.
            </p>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <ChatInterface onLayoutUpdate={handleLayoutUpdate} />
    </div>
  );
};

export default ActionItems;