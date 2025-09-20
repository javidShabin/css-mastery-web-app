import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ProgressRing from "@/components/progress-ring";
import { Link } from "wouter";
import { Trophy, Clock, Users, BookOpen, Code, Zap } from "lucide-react";
import type { Module, Lesson, UserProgress } from "@shared/schema";

interface DashboardStats {
  totalLessons: number;
  completedLessons: number;
  totalModules: number;
  studyTime: number;
}

export default function Dashboard() {
  const { data: modules, isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: ["/api/modules"]
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"]
  });

  const { data: progress } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress", "default-user"]
  });

  const { data: user } = useQuery<{ username: string }>({
    queryKey: ["/api/user/default"]
  });

  if (modulesLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your learning dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = progress?.filter(p => p.completed).length || 0;
  const totalLessons = lessons?.length || 0;
  const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const stats: DashboardStats = {
    totalLessons,
    completedLessons: completedCount,
    totalModules: modules?.length || 0,
    studyTime: completedCount * 6 // Rough estimate of 6 minutes per completed lesson
  };

  const normalizeModuleName = (moduleName: string): string => {
    const name = moduleName.toLowerCase();
    if (name.includes('grid')) return 'grid';
    if (name.includes('position')) return 'position';
    if (name.includes('flex')) return 'flexbox';
    return name.replace(/\s+/g, '');
  };

  const getModuleProgress = (moduleName: string) => {
    const moduleLessons = lessons?.filter(l => l.module === moduleName) || [];
    const completedInModule = progress?.filter(p => 
      p.completed && moduleLessons.some(l => l.id === p.lessonId)
    ).length || 0;
    return {
      completed: completedInModule,
      total: moduleLessons.length
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" data-testid="title-dashboard">
                Welcome back, {user?.username || 'Student'}! 👋
              </h1>
              <p className="text-muted-foreground">
                Ready to continue your CSS mastery journey? Let's build something amazing today.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold" data-testid="text-completed-lessons">
                        {stats.completedLessons}/{stats.totalLessons}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <BookOpen className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Modules</p>
                      <p className="text-2xl font-bold" data-testid="text-total-modules">
                        {stats.totalModules}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Clock className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Study Time</p>
                      <p className="text-2xl font-bold" data-testid="text-study-time">
                        {stats.studyTime}min
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Zap className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="text-2xl font-bold" data-testid="text-progress-percentage">
                        {completionPercentage}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Overall Progress */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <ProgressRing 
                      progress={completionPercentage} 
                      size={80}
                    />
                    <div>
                      <p className="text-2xl font-bold">{completionPercentage}%</p>
                      <p className="text-sm text-muted-foreground">
                        {stats.completedLessons} of {stats.totalLessons} lessons
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CSS Grid</span>
                      <Badge variant="secondary">
                        {getModuleProgress('grid').completed}/{getModuleProgress('grid').total}
                      </Badge>
                    </div>
                    <Progress 
                      value={(getModuleProgress('grid').completed / getModuleProgress('grid').total) * 100} 
                      className="h-2"
                    />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Flexbox</span>
                      <Badge variant="secondary">
                        {getModuleProgress('flexbox').completed}/{getModuleProgress('flexbox').total}
                      </Badge>
                    </div>
                    <Progress 
                      value={(getModuleProgress('flexbox').completed / getModuleProgress('flexbox').total) * 100} 
                      className="h-2"
                    />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Position</span>
                      <Badge variant="secondary">
                        {getModuleProgress('position').completed}/{getModuleProgress('position').total}
                      </Badge>
                    </div>
                    <Progress 
                      value={(getModuleProgress('position').completed / getModuleProgress('position').total) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Learning Modules */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Learning Modules</h2>
                  <Link href="/playground">
                    <Button variant="outline" data-testid="button-playground">
                      <Code className="h-4 w-4 mr-2" />
                      Open Playground
                    </Button>
                  </Link>
                </div>

                <div className="grid gap-6">
                  {modules?.map((module) => {
                    const normalizedModuleName = normalizeModuleName(module.name);
                    const moduleProgress = getModuleProgress(normalizedModuleName);
                    const progressPercent = moduleProgress.total > 0 
                      ? Math.round((moduleProgress.completed / moduleProgress.total) * 100) 
                      : 0;
                    
                    return (
                      <Card key={module.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <i className={`${module.icon} text-xl text-primary`}></i>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold mb-1">{module.name}</h3>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {module.description}
                                  </p>
                                </div>
                                <Badge 
                                  variant={progressPercent === 100 ? "default" : "secondary"}
                                  className="ml-4"
                                >
                                  {moduleProgress.completed}/{moduleProgress.total}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <BookOpen className="h-4 w-4" />
                                    <span>{module.totalLessons} lessons</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-4 w-4" />
                                    <span>2,847 students</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                  <Progress value={progressPercent} className="h-2" />
                                </div>
                                <span className="text-sm font-medium">{progressPercent}%</span>
                              </div>
                              
                              <div className="flex items-center justify-between mt-4">
                                <span className="text-sm text-muted-foreground">
                                  {progressPercent === 100 ? "Completed!" : `${moduleProgress.completed} lessons completed`}
                                </span>
                                <Link href={`/lesson/${lessons?.find(l => l.module === normalizedModuleName)?.id}`}>
                                  <Button 
                                    variant={progressPercent > 0 ? "default" : "outline"}
                                    size="sm"
                                    data-testid={`button-continue-${module.name.toLowerCase().replace(' ', '-')}`}
                                  >
                                    {progressPercent > 0 ? "Continue" : "Start Learning"}
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ready to continue learning?</h3>
                    <p className="text-muted-foreground">
                      Jump back into your next lesson or explore the interactive playground.
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <Link href="/playground">
                      <Button variant="outline" data-testid="button-playground-secondary">
                        <Code className="h-4 w-4 mr-2" />
                        Playground
                      </Button>
                    </Link>
                    <Link href={`/lesson/${lessons?.find(l => !progress?.some(p => p.lessonId === l.id && p.completed))?.id}`}>
                      <Button data-testid="button-next-lesson">
                        Next Lesson
                        <i className="fas fa-arrow-right ml-2"></i>
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
