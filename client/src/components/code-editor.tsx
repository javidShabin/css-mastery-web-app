import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play, Copy, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Lesson } from "@shared/schema";

interface CodeEditorProps {
  lesson?: Lesson;
  activeTab: 'html' | 'css' | 'result';
  initialCode?: string;
  htmlCode?: string;
  cssCode?: string;
  onHtmlChange?: (code: string) => void;
  onCssChange?: (code: string) => void;
  isPlayground?: boolean;
}

export default function CodeEditor({ 
  lesson, 
  activeTab, 
  initialCode = '',
  htmlCode: externalHtmlCode = '',
  cssCode: externalCssCode = '',
  onHtmlChange,
  onCssChange,
  isPlayground = false
}: CodeEditorProps) {
  const { toast } = useToast();
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [cssErrors, setCssErrors] = useState<string[]>([]);
  const [htmlErrors, setHtmlErrors] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize code based on lesson or external props
  useEffect(() => {
    if (isPlayground) {
      setHtmlCode(externalHtmlCode);
      setCssCode(externalCssCode);
    } else if (lesson) {
      const content = JSON.parse(lesson.content);
      const exercises = JSON.parse(lesson.exercises);
      
      // Default HTML for lessons
      const defaultHtml = `<div class="grid-container">
  <div class="header">Header</div>
  <div class="sidebar">Sidebar</div>
  <div class="main">Main Content</div>
  <div class="footer">Footer</div>
</div>`;

      setHtmlCode(defaultHtml);
      setCssCode(exercises[0]?.initialCode || content.codeExample || initialCode);
    }
  }, [lesson, initialCode, isPlayground, externalHtmlCode, externalCssCode]);

  // Validation functions
  const validateCSS = (code: string): string[] => {
    const errors: string[] = [];
    
    // Check for unmatched braces
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`Unmatched braces: ${openBraces} opening, ${closeBraces} closing`);
    }

    // Check for common CSS syntax issues
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}') && !trimmed.includes('@')) {
        if (trimmed.includes(':') && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
          errors.push(`Line ${index + 1}: Missing semicolon`);
        }
      }
    });

    return errors;
  };

  const validateHTML = (code: string): string[] => {
    const errors: string[] = [];
    
    // Check for unmatched tags
    const tagRegex = /<\/?[^>]+>/g;
    const tags = code.match(tagRegex) || [];
    const openTags: string[] = [];
    const closeTags: string[] = [];

    tags.forEach(tag => {
      if (tag.startsWith('</')) {
        closeTags.push(tag.slice(2, -1).split(' ')[0]);
      } else if (!tag.endsWith('/>')) {
        openTags.push(tag.slice(1, -1).split(' ')[0]);
      }
    });

    // Simple tag matching check
    const sortedOpen = [...openTags].sort();
    const sortedClose = [...closeTags].sort();
    if (JSON.stringify(sortedOpen) !== JSON.stringify(sortedClose)) {
      errors.push('Unmatched HTML tags detected');
    }

    return errors;
  };

  // Handle code changes
  const handleHtmlChange = (code: string) => {
    setHtmlCode(code);
    setHtmlErrors(validateHTML(code));
    onHtmlChange?.(code);
  };

  const handleCssChange = (code: string) => {
    setCssCode(code);
    setCssErrors(validateCSS(code));
    onCssChange?.(code);
  };

  const handleReset = () => {
    if (isPlayground) {
      // Reset handled by parent component
      return;
    }
    
    if (lesson) {
      const exercises = JSON.parse(lesson.exercises);
      setCssCode(exercises[0]?.initialCode || '');
      toast({
        title: "Code Reset",
        description: "Editor has been reset to initial state.",
      });
    }
  };

  const handleCopy = async () => {
    try {
      const codeToCopy = activeTab === 'html' ? htmlCode : cssCode;
      await navigator.clipboard.writeText(codeToCopy);
      toast({
        title: "Copied!",
        description: `${activeTab.toUpperCase()} code copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const generatePreviewCode = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #f8fafc;
            }
            .grid-container, .flex-container, .position-container {
              min-height: 200px;
              background: white;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            }
            .grid-container > div,
            .flex-container > div,
            .position-container > div {
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              color: white;
              padding: 15px;
              border-radius: 6px;
              font-weight: bold;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode}
        </body>
      </html>
    `;
  };

  return (
    <div className="flex-1 flex flex-col">
      {activeTab === 'result' ? (
        <div className="flex-1 p-4 bg-background">
          <div className="w-full h-full bg-white border border-border rounded-lg shadow-sm overflow-auto">
            <iframe
              srcDoc={generatePreviewCode()}
              className="w-full h-full"
              title="CSS Preview"
              data-testid="iframe-editor-preview"
            />
          </div>
        </div>
      ) : (
        <>
          {/* Code Editor Toolbar */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium capitalize">
                {activeTab} Editor
              </div>
              {((activeTab === 'css' && cssErrors.length > 0) || (activeTab === 'html' && htmlErrors.length > 0)) ? (
                <div className="flex items-center space-x-1 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs">
                    {(activeTab === 'css' ? cssErrors : htmlErrors).length} error{(activeTab === 'css' ? cssErrors : htmlErrors).length !== 1 ? 's' : ''}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs">Valid</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                data-testid="button-copy-code"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                data-testid="button-reset-code"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {((activeTab === 'css' && cssErrors.length > 0) || (activeTab === 'html' && htmlErrors.length > 0)) && (
            <div className="bg-red-50 border-b border-red-200 p-3">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">Errors Found</span>
              </div>
              <div className="space-y-1">
                {(activeTab === 'css' ? cssErrors : htmlErrors).map((error, index) => (
                  <div key={index} className="text-xs text-red-600">
                    • {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Editor */}
          <div className="flex-1 code-editor min-h-[400px]">
            <textarea
              value={activeTab === 'html' ? htmlCode : cssCode}
              onChange={(e) => 
                activeTab === 'html' 
                  ? handleHtmlChange(e.target.value)
                  : handleCssChange(e.target.value)
              }
              className="w-full h-full min-h-[400px] p-4 font-mono text-sm resize-none focus:outline-none border-0"
              placeholder={
                activeTab === 'html' 
                  ? "Enter your HTML code here..." 
                  : "Enter your CSS code here..."
              }
              spellCheck={false}
              data-testid={`textarea-${activeTab}-code`}
            />
          </div>
        </>
      )}
    </div>
  );
}
