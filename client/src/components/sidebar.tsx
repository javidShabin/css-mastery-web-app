import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgressRing from "@/components/progress-ring";
import { ChevronDown, ChevronRight, Check, Clock, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Module, Lesson, UserProgress } from "@shared/schema";

export default function Sidebar() {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [expandedModules, setExpandedModules] = useState<string[]>(['grid']);

  const { data: modules } = useQuery<Module[]>({
    queryKey: ["/api/modules"]
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"]
  });

  const { data: progress } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress", "default-user"]
  });

  // Don't show sidebar on mobile
  if (isMobile) {
    return null;
  }

  const completedLessons = progress?.filter(p => p.completed).length || 0;
  const totalLessons = lessons?.length || 0;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const toggleModule = (moduleName: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleName)
        ? prev.filter(m => m !== moduleName)
        : [...prev, moduleName]
    );
  };

  const getModuleLessons = (moduleName: string) => {
    return lessons?.filter(l => l.module === moduleName).sort((a, b) => a.order - b.order) || [];
  };

  const getModuleProgress = (moduleName: string) => {
    const moduleLessons = getModuleLessons(moduleName);
    const completedInModule = progress?.filter(p => 
      p.completed && moduleLessons.some(l => l.id === p.lessonId)
    ).length || 0;
    return {
      completed: completedInModule,
      total: moduleLessons.length
    };
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress?.some(p => p.lessonId === lessonId && p.completed) || false;
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  const getModuleDisplayName = (moduleName: string) => {
    switch (moduleName) {
      case 'grid': return 'CSS Grid';
      case 'flexbox': return 'Flexbox'; 
      case 'position': return 'CSS Position';
      default: return moduleName;
    }
  };

  const getModuleIcon = (moduleName: string) => {
    switch (moduleName) {
      case 'grid': return 'fas fa-th';
      case 'flexbox': return 'fas fa-arrows-alt';
      case 'position': return 'fas fa-layer-group';
      default: return 'fas fa-book';
    }
  };

  return (
    <aside className="w-80 bg-card border-r border-border hidden lg:block" data-testid="sidebar">
      <div className="p-6">
        {/* Overall Progress */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Course Progress</h2>
          <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
            <ProgressRing progress={overallProgress} size={64} />
            <div>
              <p className="font-medium" data-testid="text-overall-progress">
                Overall Progress
              </p>
              <p className="text-sm text-muted-foreground" data-testid="text-progress-details">
                {completedLessons} of {totalLessons} lessons
              </p>
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <nav className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Modules
          </h3>
          
          {modules?.map((module) => {
            const moduleName = module.name.toLowerCase().replace(' ', '');
            const moduleProgress = getModuleProgress(moduleName);
            const isExpanded = expandedModules.includes(moduleName);
            const progressPercent = moduleProgress.total > 0 
              ? Math.round((moduleProgress.completed / moduleProgress.total) * 100) 
              : 0;
            const isCurrentModule = location.includes(moduleName) || 
              (location.includes('lesson') && lessons?.find(l => location.includes(l.id))?.module === moduleName);

            return (
              <div key={module.id} className="space-y-1">
                <Button
                  variant={isCurrentModule ? "default" : "ghost"}
                  className="w-full justify-between p-3 h-auto"
                  onClick={() => toggleModule(moduleName)}
                  data-testid={`button-module-${moduleName}`}
                >
                  <div className="flex items-center space-x-3">
                    <i className={`${getModuleIcon(moduleName)} text-sm`}></i>
                    <span className="font-medium">{getModuleDisplayName(moduleName)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={progressPercent === 100 ? "default" : "secondary"}
                      className="text-xs"
                      data-testid={`badge-progress-${moduleName}`}
                    >
                      {moduleProgress.completed}/{moduleProgress.total}
                    </Badge>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </Button>

                {isExpanded && (
                  <div className="ml-4 space-y-1" data-testid={`lessons-${moduleName}`}>
                    {getModuleLessons(moduleName).map((lesson) => {
                      const isCompleted = isLessonCompleted(lesson.id);
                      const isCurrentLesson = location.includes(lesson.id);
                      
                      return (
                        <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                          <Button
                            variant={isCurrentLesson ? "secondary" : "ghost"}
                            className="w-full justify-between p-2 h-auto text-sm hover:bg-muted transition-colors"
                            data-testid={`button-lesson-${lesson.id}`}
                          >
                            <div className="flex items-center space-x-2">
                              {isCompleted ? (
                                <Check className="h-4 w-4 text-accent" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                              )}
                              <span className={isCompleted ? "text-foreground" : "text-muted-foreground"}>
                                {lesson.title}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatDuration(lesson.duration)}</span>
                            </div>
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Quick Tip */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              <h4 className="font-medium text-accent">Quick Tip</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Use the live editor to experiment with different values and see instant results!
            </p>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
