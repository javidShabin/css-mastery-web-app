// Monaco Editor configuration for CSS/HTML editing
// This would be used if we integrate Monaco Editor for better syntax highlighting

export const monacoOptions = {
  minimap: { enabled: false },
  lineNumbers: 'on' as const,
  roundedSelection: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
  tabSize: 2,
  insertSpaces: true,
  wordWrap: 'on' as const,
  lineHeight: 1.5,
  padding: { top: 16, bottom: 16 },
};

export const cssCompletionItems = [
  {
    label: 'display',
    kind: 14, // Property
    insertText: 'display: ',
    documentation: 'Sets whether an element is treated as a block or inline element',
  },
  {
    label: 'grid',
    kind: 12, // Value
    insertText: 'grid',
    documentation: 'The element generates a block-level grid container',
  },
  {
    label: 'flex',
    kind: 12, // Value
    insertText: 'flex',
    documentation: 'The element generates a block-level flex container',
  },
  {
    label: 'grid-template-columns',
    kind: 14, // Property
    insertText: 'grid-template-columns: ',
    documentation: 'Defines the columns of the grid with a space-separated list of values',
  },
  {
    label: 'grid-template-rows',
    kind: 14, // Property
    insertText: 'grid-template-rows: ',
    documentation: 'Defines the rows of the grid with a space-separated list of values',
  },
  {
    label: 'grid-template-areas',
    kind: 14, // Property
    insertText: 'grid-template-areas: ',
    documentation: 'Specifies named grid areas',
  },
  {
    label: 'justify-content',
    kind: 14, // Property
    insertText: 'justify-content: ',
    documentation: 'Defines how flexbox items are aligned along the main axis',
  },
  {
    label: 'align-items',
    kind: 14, // Property
    insertText: 'align-items: ',
    documentation: 'Defines how flexbox items are aligned along the cross axis',
  },
  {
    label: 'position',
    kind: 14, // Property
    insertText: 'position: ',
    documentation: 'Sets how an element is positioned in a document',
  },
  {
    label: 'relative',
    kind: 12, // Value
    insertText: 'relative',
    documentation: 'The element is positioned relative to its normal position',
  },
  {
    label: 'absolute',
    kind: 12, // Value
    insertText: 'absolute',
    documentation: 'The element is positioned relative to its nearest positioned ancestor',
  },
  {
    label: 'fixed',
    kind: 12, // Value
    insertText: 'fixed',
    documentation: 'The element is positioned relative to the viewport',
  },
];

export const htmlCompletionItems = [
  {
    label: 'div',
    kind: 25, // Snippet
    insertText: '<div class="$1">$2</div>',
    documentation: 'A generic container element',
  },
  {
    label: 'grid-container',
    kind: 25, // Snippet
    insertText: '<div class="grid-container">\n  $1\n</div>',
    documentation: 'A container for CSS Grid layout',
  },
  {
    label: 'flex-container',
    kind: 25, // Snippet
    insertText: '<div class="flex-container">\n  $1\n</div>',
    documentation: 'A container for Flexbox layout',
  },
];
