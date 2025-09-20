// This file contains lesson data and utilities
// In a real application, this would come from the API

export interface LessonExercise {
  instruction: string;
  initialCode: string;
  solution: string;
  hints?: string[];
}

export interface LessonContent {
  introduction: string;
  keyPoints: string[];
  codeExample: string;
  visualExample?: string;
  exercises: LessonExercise[];
}

export const lessonTemplates = {
  grid: {
    basic: {
      html: `<div class="grid-container">
  <div class="grid-item">1</div>
  <div class="grid-item">2</div>
  <div class="grid-item">3</div>
  <div class="grid-item">4</div>
  <div class="grid-item">5</div>
  <div class="grid-item">6</div>
</div>`,
      css: `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 100px);
  gap: 20px;
  padding: 20px;
  background: #f3f4f6;
  border-radius: 8px;
}

.grid-item {
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
    areas: {
      html: `<div class="grid-container">
  <div class="header">Header</div>
  <div class="sidebar">Sidebar</div>
  <div class="main">Main Content</div>
  <div class="footer">Footer</div>
</div>`,
      css: `.grid-container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 200px 1fr 1fr;
  gap: 20px;
  height: 400px;
  padding: 20px;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }

.header, .sidebar, .main, .footer {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 8px;
}`
    }
  },
  flexbox: {
    basic: {
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
  gap: 20px;
}

.flex-item {
  background: linear-gradient(135deg, #10b981, #3b82f6);
  color: white;
  padding: 20px;
  border-radius: 8px;
  font-weight: bold;
  flex: 1;
  text-align: center;
}`
    }
  },
  position: {
    basic: {
      html: `<div class="position-container">
  <div class="positioned-item absolute-item">Absolute</div>
  <div class="positioned-item relative-item">Relative</div>
  <div class="positioned-item static-item">Static</div>
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
  margin: 10px 0;
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

.static-item {
  position: static;
}`
    }
  }
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'text-green-600 bg-green-100';
    case 'intermediate':
      return 'text-yellow-600 bg-yellow-100';
    case 'advanced':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const getModuleIcon = (moduleName: string): string => {
  switch (moduleName.toLowerCase()) {
    case 'grid':
    case 'css grid':
      return 'fas fa-th';
    case 'flexbox':
      return 'fas fa-arrows-alt';
    case 'position':
    case 'css position':
      return 'fas fa-layer-group';
    default:
      return 'fas fa-book';
  }
};
