import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import CodeEditor from "@/components/code-editor";
import LessonContent from "@/components/lesson-content";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Clock, Signal, Users, Bookmark, ArrowLeft, ArrowRight, Check, Lightbulb, Eye, EyeOff } from "lucide-react";
import type { Lesson, UserProgress } from "@shared/schema";

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'result'>('html');
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: ["/api/lessons", id]
  });

  const { data: allLessons } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"]
  });

  const { data: progress } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress", "default-user"]
  });

  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      if (!lesson) throw new Error("No lesson found");
      
      return await apiRequest("POST", "/api/progress", {
        userId: "default-user",
        lessonId: lesson.id,
        completed: true,
        codeSubmissions: JSON.stringify([])
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress", "default-user"] });
      toast({
        title: "Lesson Complete! 🎉",
        description: "Great job! You've completed this lesson.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete. Please try again.",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-4">Lesson Not Found</h1>
                <p className="text-muted-foreground mb-6">
                  The lesson you're looking for doesn't exist.
                </p>
                <Link href="/">
                  <Button>Back to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isCompleted = progress?.some(p => p.lessonId === lesson.id && p.completed) || false;
  const currentModuleLessons = allLessons?.filter(l => l.module === lesson.module).sort((a, b) => a.order - b.order) || [];
  const currentIndex = currentModuleLessons.findIndex(l => l.id === lesson.id);
  const nextLesson = currentModuleLessons[currentIndex + 1];
  const prevLesson = currentModuleLessons[currentIndex - 1];

  const lessonContent = JSON.parse(lesson.content);
  const exercises = JSON.parse(lesson.exercises);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModuleDisplayName = (module: string) => {
    switch (module) {
      case 'grid': return 'CSS Grid';
      case 'flexbox': return 'Flexbox';
      case 'position': return 'CSS Position';
      default: return module;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 flex flex-col h-[calc(100vh-80px)]">
          {/* Lesson Header */}
          <div className="bg-card border-b border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                  <span>{getModuleDisplayName(lesson.module)}</span>
                  <i className="fas fa-chevron-right text-xs"></i>
                  <span data-testid="text-lesson-position">
                    Lesson {lesson.order} of {currentModuleLessons.length}
                  </span>
                </div>
                <h1 className="text-2xl font-bold" data-testid="title-lesson">
                  {lesson.title}
                </h1>
                <p className="text-muted-foreground mt-1">{lesson.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" data-testid="button-bookmark">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark
                </Button>
                {nextLesson && (
                  <Link href={`/lesson/${nextLesson.id}`}>
                    <Button size="sm" data-testid="button-next-lesson">
                      Next Lesson
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground" data-testid="text-duration">
                  {lesson.duration} minutes
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Signal className="h-4 w-4 text-muted-foreground" />
                <Badge 
                  variant="secondary" 
                  className={getDifficultyColor(lesson.difficulty)}
                  data-testid="badge-difficulty"
                >
                  {lesson.difficulty}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">2,847 students</span>
              </div>
              {isCompleted && (
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-accent font-medium" data-testid="text-completed">
                    Completed
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Theory Section */}
            <div className="flex-1 overflow-y-auto">
              <LessonContent 
                content={lessonContent}
                exercises={exercises}
              />
            </div>

            {/* Interactive Code Editor */}
            <div className="w-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-border flex flex-col">
              {/* Editor Header */}
              <div className="bg-card border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-medium">Live Code Editor</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHints(!showHints)}
                      className="ml-auto"
                    >
                      {showHints ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showHints ? 'Hide Hints' : 'Show Hints'}
                    </Button>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setActiveTab('html')}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          activeTab === 'html'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        data-testid="button-tab-html"
                      >
                        HTML
                      </button>
                      <button
                        onClick={() => setActiveTab('css')}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          activeTab === 'css'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        data-testid="button-tab-css"
                      >
                        CSS
                      </button>
                      <button
                        onClick={() => setActiveTab('result')}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          activeTab === 'result'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        data-testid="button-tab-result"
                      >
                        Result
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hints Panel */}
              {showHints && exercises.length > 0 && (
                <div className="bg-accent/10 border-b border-border p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-accent" />
                    <h4 className="font-medium text-accent">Exercise Hints</h4>
                  </div>
                  <div className="space-y-2">
                    {exercises.map((exercise: any, index: number) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium mb-1">Hint {index + 1}:</p>
                        <p className="text-muted-foreground">{exercise.instruction}</p>
                        {exercise.hint && (
                          <p className="text-xs text-accent mt-1 italic">
                            💡 {exercise.hint}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <CodeEditor 
                lesson={lesson}
                activeTab={activeTab}
                initialCode={lessonContent.codeExample || ''}
              />
            </div>
          </div>

          {/* Lesson Footer */}
          <div className="bg-card border-t border-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {prevLesson && (
                  <Link href={`/lesson/${prevLesson.id}`}>
                    <Button variant="outline" size="sm" data-testid="button-previous">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  </Link>
                )}
                <div className="text-sm text-muted-foreground">
                  Lesson {lesson.order} of {currentModuleLessons.length} in {getModuleDisplayName(lesson.module)}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markCompleteMutation.mutate()}
                  disabled={isCompleted || markCompleteMutation.isPending}
                  data-testid="button-mark-complete"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isCompleted ? "Completed" : "Mark Complete"}
                </Button>
                {nextLesson && (
                  <Link href={`/lesson/${nextLesson.id}`}>
                    <Button size="sm" data-testid="button-next-lesson-footer">
                      Next: {nextLesson.title}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
