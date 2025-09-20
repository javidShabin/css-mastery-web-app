import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Lightbulb } from "lucide-react";

interface LessonContentProps {
  content: {
    introduction: string;
    keyPoints: string[];
    codeExample: string;
  };
  exercises: Array<{
    instruction: string;
    initialCode: string;
    solution: string;
  }>;
}

export default function LessonContent({ content, exercises }: LessonContentProps) {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Introduction */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Introduction</h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-muted-foreground leading-relaxed" data-testid="text-introduction">
            {content.introduction}
          </p>
        </div>
      </section>

      {/* Visual Example */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Visual Example</h3>
        <Card className="border">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 grid-rows-3 gap-2 h-64 mb-4">
              <div className="grid-demo-item rounded flex items-center justify-center font-medium text-sm col-span-3">
                Header
              </div>
              <div className="grid-demo-item rounded flex items-center justify-center font-medium text-sm">
                Sidebar
              </div>
              <div className="grid-demo-item rounded flex items-center justify-center font-medium text-sm col-span-2">
                Main Content
              </div>
              <div className="grid-demo-item rounded flex items-center justify-center font-medium text-sm col-span-3">
                Footer
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center" data-testid="text-example-caption">
              A typical web layout using named grid areas
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Code Example */}
      <section>
        <h3 className="text-lg font-semibold mb-4">CSS Code</h3>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre className="text-slate-100" data-testid="code-example">
            <code dangerouslySetInnerHTML={{ __html: formatCodeExample(content.codeExample) }} />
          </pre>
        </div>
      </section>

      {/* Key Points */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Key Points</h3>
        <div className="space-y-4">
          {content.keyPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
              <Check className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm" data-testid={`text-key-point-${index}`}>
                  {point}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exercise Instructions */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Try It Yourself</h3>
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-accent mb-2">Exercise</h4>
                {exercises.map((exercise, index) => (
                  <p key={index} className="text-sm" data-testid={`text-exercise-${index}`}>
                    {exercise.instruction}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Learning Objectives */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Learning Objectives</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary" className="text-xs">Theory</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Understand the concept and syntax of CSS Grid template areas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary" className="text-xs">Practice</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Create layouts using named grid areas in the interactive editor
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function formatCodeExample(code: string): string {
  // Simple syntax highlighting for CSS
  return code
    .replace(/([.#][\w-]+)/g, '<span class="text-yellow-300">$1</span>')
    .replace(/([\w-]+)(\s*:)/g, '<span class="text-green-300">$1</span><span class="text-slate-400">$2</span>')
    .replace(/(".*?")/g, '<span class="text-yellow-300">$1</span>')
    .replace(/({|})/g, '<span class="text-slate-400">$1</span>')
    .replace(/(;)/g, '<span class="text-slate-400">$1</span>');
}
