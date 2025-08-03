import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIWorkloadAnalysis } from '@/components/AIWorkloadAnalysis';
import { AISmartFilters } from '@/components/AISmartFilters';
import { AIActionSuggestions } from '@/components/AIActionSuggestions';
import { AITabs } from '@/components/AITabs';
import { ChatInterface } from '@/components/ChatInterface';
import { CalendarWidget } from '@/components/CalendarWidget';
import ManualTodoInput, { ManualTodo } from '@/components/ManualTodoInput';
import ManualTodoCard from '@/components/ManualTodoCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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

const Index = () => {
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [manualTodos, setManualTodos] = useState<ManualTodo[]>([]);
  const [localTodos, setLocalTodos] = useState<ManualTodo[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load local todos from localStorage
  useEffect(() => {
    const savedLocalTodos = localStorage.getItem('guest-todos');
    if (savedLocalTodos) {
      try {
        const parsed = JSON.parse(savedLocalTodos);
        const formattedTodos = parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          scheduledDate: todo.scheduledDate ? new Date(todo.scheduledDate) : undefined
        }));
        setLocalTodos(formattedTodos);
      } catch (error) {
        console.error('Error parsing local todos:', error);
      }
    }
  }, []);

  // Save local todos to localStorage
  const saveLocalTodos = (todos: ManualTodo[]) => {
    localStorage.setItem('guest-todos', JSON.stringify(todos));
    setLocalTodos(todos);
  };

  // Load user session and database todos on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        await loadDatabaseTodos();
        // Offer to sync local todos if any exist
        if (localTodos.length > 0) {
          offerToSyncLocalTodos();
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadDatabaseTodos();
          // Offer to sync local todos when user signs in
          if (localTodos.length > 0) {
            setTimeout(() => offerToSyncLocalTodos(), 1000);
          }
        } else {
          setManualTodos([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [localTodos]);

  const loadDatabaseTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTodos: ManualTodo[] = data.map(todo => ({
        id: todo.id,
        title: todo.title,
        description: todo.description || '',
        completed: todo.completed,
        scheduledDate: todo.scheduled_date ? new Date(todo.scheduled_date) : undefined,
        createdAt: new Date(todo.created_at)
      }));

      setManualTodos(formattedTodos);
    } catch (error: any) {
      console.error('Error loading todos:', error);
      toast({
        title: "Error loading todos",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const offerToSyncLocalTodos = () => {
    toast({
      title: "Sync your local todos?",
      description: `You have ${localTodos.length} local todos. Would you like to sync them to your account?`,
      action: (
        <Button 
          size="sm" 
          onClick={syncLocalTodos}
          className="bg-gradient-ai hover:opacity-90"
        >
          Sync Now
        </Button>
      ),
    });
  };

  const syncLocalTodos = async () => {
    if (!user || localTodos.length === 0) return;

    try {
      const todosToSync = localTodos.map(todo => ({
        user_id: user.id,
        title: todo.title,
        description: todo.description,
        scheduled_date: todo.scheduledDate?.toISOString(),
        completed: todo.completed
      }));

      const { error } = await supabase
        .from('todos')
        .insert(todosToSync);

      if (error) throw error;

      // Clear local todos after successful sync
      localStorage.removeItem('guest-todos');
      setLocalTodos([]);
      
      // Reload database todos
      await loadDatabaseTodos();
      
      toast({
        title: "Todos synced successfully!",
        description: `${todosToSync.length} todos have been synced to your account.`
      });
    } catch (error: any) {
      console.error('Error syncing todos:', error);
      toast({
        title: "Error syncing todos",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  // Mock data for demonstration with AI enhancements
  const actionItems: ActionItem[] = [
    // Approvals (Concur) items first
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
    // Recruiting items second
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
    },
    // Google Docs items third
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
    // SLA Tasks (Jira) items fourth
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
      case 'jira': return 'SLA Tasks';
      case 'concur': return 'Approvals';
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

  // Todo functions supporting both guest and authenticated modes
  const handleAddTodo = async (todoData: Omit<ManualTodo, 'id' | 'createdAt'>) => {
    if (!user) {
      // Guest mode - save locally
      const newTodo: ManualTodo = {
        ...todoData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      const updatedLocalTodos = [newTodo, ...localTodos];
      saveLocalTodos(updatedLocalTodos);
      
      toast({
        title: "Todo created locally",
        description: "Sign in to sync across devices"
      });
      return;
    }

    // Authenticated mode - save to database
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          user_id: user.id,
          title: todoData.title,
          description: todoData.description,
          scheduled_date: todoData.scheduledDate?.toISOString(),
          completed: false
        }])
        .select()
        .single();

      if (error) throw error;

      const newTodo: ManualTodo = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        completed: data.completed,
        scheduledDate: data.scheduled_date ? new Date(data.scheduled_date) : undefined,
        createdAt: new Date(data.created_at)
      };

      setManualTodos([newTodo, ...manualTodos]);
      
      toast({
        title: "Todo created",
        description: "Your todo has been saved successfully"
      });
    } catch (error: any) {
      console.error('Error creating todo:', error);
      toast({
        title: "Error creating todo",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleToggleTodoComplete = async (id: string) => {
    if (!user) {
      // Guest mode - update locally
      const updatedLocalTodos = localTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveLocalTodos(updatedLocalTodos);
      return;
    }

    // Authenticated mode - update database
    try {
      const todo = manualTodos.find(t => t.id === id);
      if (!todo) return;

      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;

      setManualTodos(manualTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    } catch (error: any) {
      console.error('Error updating todo:', error);
      toast({
        title: "Error updating todo",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditTodo = async (id: string, updates: Partial<ManualTodo>) => {
    if (!user) {
      // Guest mode - update locally
      const updatedLocalTodos = localTodos.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      );
      saveLocalTodos(updatedLocalTodos);
      return;
    }

    // Authenticated mode - update database
    try {
      const { error } = await supabase
        .from('todos')
        .update({
          title: updates.title,
          description: updates.description,
          scheduled_date: updates.scheduledDate?.toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setManualTodos(manualTodos.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      ));

      toast({
        title: "Todo updated",
        description: "Your changes have been saved"
      });
    } catch (error: any) {
      console.error('Error updating todo:', error);
      toast({
        title: "Error updating todo",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!user) {
      // Guest mode - delete locally
      const updatedLocalTodos = localTodos.filter(todo => todo.id !== id);
      saveLocalTodos(updatedLocalTodos);
      return;
    }

    // Authenticated mode - delete from database
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setManualTodos(manualTodos.filter(todo => todo.id !== id));
      
      toast({
        title: "Todo deleted",
        description: "Todo has been removed successfully"
      });
    } catch (error: any) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Error deleting todo",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Get current todos based on authentication state
  const currentTodos = user ? manualTodos : localTodos;

  return (
    <div className="min-h-screen bg-gradient-subtle font-body">
      {/* Meta-style Header */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-background/95 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div>
                <h1 className="text-xl font-bold bg-gradient-meta bg-clip-text text-transparent font-meta">
                  Smart Task Hub
                </h1>
              </div>
              
              {/* Meta-style navigation */}
              <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                <span className="text-foreground cursor-pointer hover:text-primary transition-colors">Tasks</span>
                <span className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors">AI insights</span>
                <span className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors">Calendar</span>
                <span className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors">Analytics</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {user.email}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => supabase.auth.signOut()}
                    className="hover:bg-muted/50"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => window.open('/auth', '_self')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>


      <div className="container mx-auto px-4 py-8">


        {/* Summary Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          {/* Source Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-foreground whitespace-nowrap">Filter by:</label>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-[160px] h-8 bg-background/50 border-white/20">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/20">
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="concur">Approvals</SelectItem>
                <SelectItem value="interviewing">Recruiting</SelectItem>
                <SelectItem value="google-docs">Google Docs</SelectItem>
                <SelectItem value="jira">SLA Tasks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
            <Card className="p-3 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-ai/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-ai-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{totalItems}</p>
                  <p className="text-xs text-muted-foreground">Total Items</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{highPriorityItems}</p>
                  <p className="text-xs text-muted-foreground">High Priority</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{overdueItems}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{Object.keys(filteredGroupedItems).length}</p>
                  <p className="text-xs text-muted-foreground">Sources</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content: Tabs for External Tasks and Manual Todos */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Tasks Content - Left Side (2/3 width) */}
          <div className="xl:col-span-2">
            <Tabs defaultValue="external" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="external">External Tasks</TabsTrigger>
                <TabsTrigger value="manual">My Todos ({currentTodos.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="external" className="space-y-4">
                {Object.entries(filteredGroupedItems).length === 0 ? (
                  <Card className="p-6 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted/20 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No items found</h3>
                    <p className="text-sm text-muted-foreground">
                      No action items found for the selected filter.
                    </p>
                  </Card>
                ) : (
                  Object.entries(filteredGroupedItems).map(([source, items]) => (
                <div key={source}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {getSourceIcon(source)}
                      <h2 className="text-xl font-semibold text-foreground">
                        {getSourceName(source)}
                      </h2>
                    </div>
                    <Badge className={getSourceColor(source)}>
                      {items.length} item{items.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-3">
                    {items.map((item) => (
                      <Card 
                        key={item.id}
                        className="p-4 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass hover:shadow-elevated transition-spring hover:scale-[1.01]"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-1">
                              <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
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
                            
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>
                            
                            {item.aiSuggestion && (
                              <div className="p-2 rounded-lg bg-gradient-ai/5 border border-ai-primary/20">
                                <div className="flex items-start gap-1">
                                  <Zap className="w-3 h-3 text-ai-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs font-medium text-ai-primary mb-0.5">AI Suggestion</p>
                                    <p className="text-xs text-muted-foreground">{item.aiSuggestion}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {item.dependencies && item.dependencies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                <span className="text-xs text-muted-foreground mr-2">Dependencies:</span>
                                {item.dependencies.map((dep, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                              <span>By {item.assignedBy}</span>
                              <span>•</span>
                              <span>{new Date(item.created).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Action Required Section */}
                          <div className="lg:w-64 space-y-3">
                            <div>
                              <p className="text-sm font-medium text-foreground mb-2">Action Required:</p>
                              <p className="text-xs text-muted-foreground mb-3">{item.actionRequired}</p>
                            </div>
                            
                            <Button 
                              size="sm" 
                              onClick={() => window.open(item.link, '_blank')}
                              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                            >
                              <ExternalLink className="w-3 h-3 mr-2" />
                              Open in {getSourceName(item.source)}
                            </Button>
                            
                            <div className="flex gap-2">
                              {item.source === 'concur' && (
                                <>
                                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                                    Reject
                                  </Button>
                                </>
                              )}
                              {item.source === 'interviewing' && item.type === 'Interview Feedback' && (
                                <Button size="sm" variant="outline" className="flex-1 text-xs">
                                  Submit Feedback
                                </Button>
                              )}
                              {item.source === 'interviewing' && item.type === 'Interview Invitation' && (
                                <>
                                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                                    Accept
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                                    Decline
                                  </Button>
                                </>
                              )}
                              {item.source === 'google-docs' && (
                                <Button size="sm" variant="outline" className="flex-1 text-xs">
                                  Add Comment
                                </Button>
                              )}
                              {item.source === 'jira' && (
                                <Button size="sm" variant="outline" className="flex-1 text-xs">
                                  Update Status
                                </Button>
                              )}
                            </div>
                            
                            <Button size="sm" variant="ghost" className="w-full text-xs">
                              <Calendar className="w-3 h-3 mr-2" />
                              Schedule
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4">
                <ManualTodoInput onAddTodo={handleAddTodo} />
                
                {!user && currentTodos.length === 0 ? (
                  <Card className="p-6 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-ai/10 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-ai-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Start creating todos!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your todos are saved locally. Sign in to sync across devices.
                    </p>
                    <Button onClick={() => window.open('/auth', '_self')} variant="outline" className="border-ai-primary/30 text-ai-primary hover:bg-ai-primary/10">
                      Sign In to Sync
                    </Button>
                  </Card>
                ) : currentTodos.length === 0 ? (
                  <Card className="p-6 bg-gradient-card backdrop-blur-sm border border-white/20 shadow-glass text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted/20 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No todos yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Create your first todo using the form above.
                    </p>
                  </Card>
                ) : (
                  <>
                    {!user && currentTodos.length > 0 && (
                      <Card className="p-4 bg-gradient-card backdrop-blur-sm border border-ai-primary/20 shadow-glass">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-ai-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Guest Mode</p>
                              <p className="text-xs text-muted-foreground">Sign in to sync your todos across devices</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => window.open('/auth', '_self')}
                            className="bg-gradient-ai hover:opacity-90"
                          >
                            Sign In
                          </Button>
                        </div>
                      </Card>
                    )}
                    <div className="space-y-3">
                      {currentTodos.map((todo) => (
                        <ManualTodoCard
                          key={todo.id}
                          todo={todo}
                          onToggleComplete={handleToggleTodoComplete}
                          onEdit={handleEditTodo}
                          onDelete={handleDeleteTodo}
                        />
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Calendar Widget and AI Features - Right Side (1/3 width) */}
          <div className="xl:col-span-1 space-y-6">
            <CalendarWidget 
              actionItems={filteredActionItems}
              onScheduleItem={handleScheduleItem}
            />
            
            {/* AI Features Section */}
            <AITabs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
