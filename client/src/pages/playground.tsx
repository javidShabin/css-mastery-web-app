import { useState } from "react";
import Header from "@/components/header";
import CodeEditor from "@/components/code-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { ArrowLeft, Save, Share, Download, RefreshCw } from "lucide-react";

const codeTemplates = {
  grid: {
    html: `<div class="grid-container">
  <div class="item item-1">1</div>
  <div class="item item-2">2</div>
  <div class="item item-3">3</div>
  <div class="item item-4">4</div>
  <div class="item item-5">5</div>
  <div class="item item-6">6</div>
</div>`,
    css: `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 100px);
  gap: 20px;
  padding: 20px;
}

.item {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  border-radius: 8px;
}`
  },
  flexbox: {
    html: `<div class="flex-container">
  <div class="flex-item">Item 1</div>
  <div class="flex-item">Item 2</div>
  <div class="flex-item">Item 3</div>
</div>`,
    css: `.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 200px;
  padding: 20px;
  background: #f3f4f6;
  border-radius: 8px;
}

.flex-item {
  background: linear-gradient(135deg, #10b981, #3b82f6);
  color: white;
  padding: 20px;
  border-radius: 8px;
  font-weight: bold;
}`
  },
  position: {
    html: `<div class="position-container">
  <div class="positioned-item absolute-item">Absolute</div>
  <div class="positioned-item relative-item">Relative</div>
  <div class="positioned-item fixed-item">Fixed</div>
</div>`,
    css: `.position-container {
  position: relative;
  height: 300px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 8px;
  padding: 20px;
}

.positioned-item {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
  padding: 15px;
  border-radius: 6px;
  font-weight: bold;
}

.absolute-item {
  position: absolute;
  top: 20px;
  right: 20px;
}

.relative-item {
  position: relative;
  top: 20px;
  left: 20px;
}

.fixed-item {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}`
  }
};

export default function Playground() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof codeTemplates>('grid');
  const [htmlCode, setHtmlCode] = useState(codeTemplates.grid.html);
  const [cssCode, setCssCode] = useState(codeTemplates.grid.css);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'result'>('html');

  const handleTemplateChange = (template: keyof typeof codeTemplates) => {
    setSelectedTemplate(template);
    setHtmlCode(codeTemplates[template].html);
    setCssCode(codeTemplates[template].css);
  };

  const handleReset = () => {
    setHtmlCode(codeTemplates[selectedTemplate].html);
    setCssCode(codeTemplates[selectedTemplate].css);
  };

  const generatePreviewCode = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Playground Header */}
        <div className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold" data-testid="title-playground">
                  CSS Playground
                </h1>
                <p className="text-muted-foreground">
                  Experiment with CSS properties and see real-time results
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" data-testid="button-save">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" data-testid="button-share">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset} data-testid="button-reset">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Template Selection */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Quick Templates:</span>
            <div className="flex space-x-2">
              {Object.entries(codeTemplates).map(([key, _]) => (
                <Button
                  key={key}
                  variant={selectedTemplate === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTemplateChange(key as keyof typeof codeTemplates)}
                  data-testid={`button-template-${key}`}
                >
                  {key === 'grid' ? 'CSS Grid' : key === 'flexbox' ? 'Flexbox' : 'Position'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="flex h-[calc(100vh-180px)]">
          {/* Code Editor Section */}
          <div className="w-1/2 border-r border-border flex flex-col">
            {/* Editor Tabs */}
            <div className="bg-card border-b border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="font-medium">Code Editor</h3>
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
                <Badge variant="secondary" data-testid="badge-template">
                  {selectedTemplate === 'grid' ? 'CSS Grid' : 
                   selectedTemplate === 'flexbox' ? 'Flexbox' : 'Position'}
                </Badge>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1">
              <CodeEditor
                activeTab={activeTab}
                htmlCode={htmlCode}
                cssCode={cssCode}
                onHtmlChange={setHtmlCode}
                onCssChange={setCssCode}
                isPlayground={true}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="w-1/2 flex flex-col">
            {/* Preview Header */}
            <div className="bg-card border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Live Preview</h3>
                <div className="flex space-x-1">
                  <button 
                    className="p-2 text-xs bg-muted rounded" 
                    title="Desktop"
                    data-testid="button-preview-desktop"
                  >
                    <i className="fas fa-desktop"></i>
                  </button>
                  <button 
                    className="p-2 text-xs text-muted-foreground hover:bg-muted rounded" 
                    title="Tablet"
                    data-testid="button-preview-tablet"
                  >
                    <i className="fas fa-tablet-alt"></i>
                  </button>
                  <button 
                    className="p-2 text-xs text-muted-foreground hover:bg-muted rounded" 
                    title="Mobile"
                    data-testid="button-preview-mobile"
                  >
                    <i className="fas fa-mobile-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 p-4 bg-background">
              <div className="w-full h-full bg-white border border-border rounded-lg shadow-sm overflow-auto">
                <iframe
                  srcDoc={generatePreviewCode()}
                  className="w-full h-full"
                  title="CSS Preview"
                  data-testid="iframe-preview"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tips and Shortcuts */}
        <div className="bg-card border-t border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+S</kbd> Save</span>
              <span><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+R</kbd> Reset</span>
              <span><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+/</kbd> Comment</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <i className="fas fa-lightbulb text-accent"></i>
              <span>Try modifying the CSS properties to see live changes!</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
