import { type User, type InsertUser, type Lesson, type InsertLesson, type UserProgress, type InsertUserProgress, type Module, type InsertModule } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lesson methods
  getLessons(): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  getLessonsByModule(module: string): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  // Module methods
  getModules(): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  
  // Progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressForLesson(userId: string, lessonId: string): Promise<UserProgress | undefined>;
  createOrUpdateProgress(progress: InsertUserProgress): Promise<UserProgress>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private lessons: Map<string, Lesson>;
  private modules: Map<string, Module>;
  private userProgress: Map<string, UserProgress>;

  constructor() {
    this.users = new Map();
    this.lessons = new Map();
    this.modules = new Map();
    this.userProgress = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize default user
    const defaultUser: User = {
      id: "default-user",
      username: "student",
      email: "student@cssacademy.com",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Initialize modules
    const gridModule: Module = {
      id: "grid-module",
      name: "CSS Grid",
      description: "Master CSS Grid layout system with hands-on exercises",
      order: 1,
      icon: "fas fa-th",
      totalLessons: 8,
    };

    const flexModule: Module = {
      id: "flex-module",
      name: "Flexbox",
      description: "Learn flexible box layout for responsive designs",
      order: 2,
      icon: "fas fa-arrows-alt",
      totalLessons: 8,
    };

    const positionModule: Module = {
      id: "position-module",
      name: "CSS Position",
      description: "Understanding positioning contexts and stacking",
      order: 3,
      icon: "fas fa-layer-group",
      totalLessons: 8,
    };

    [gridModule, flexModule, positionModule].forEach(module => {
      this.modules.set(module.id, module);
    });

    // Initialize sample lessons
    this.initializeLessons();
  }

  private initializeLessons() {
    const lessons: Lesson[] = [
      // Grid lessons
      {
        id: "grid-1",
        title: "Grid Container Basics",
        description: "Learn how to create a grid container and basic grid properties",
        module: "grid",
        order: 1,
        duration: 5,
        difficulty: "beginner",
        content: JSON.stringify({
          introduction: "CSS Grid is a two-dimensional layout system that allows you to create complex layouts with rows and columns.",
          keyPoints: [
            "Use display: grid to create a grid container",
            "Grid items are direct children of grid containers",
            "Grid creates implicit tracks automatically"
          ],
          codeExample: ".container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 100px 100px;\n  gap: 20px;\n}"
        }),
        exercises: JSON.stringify([
          {
            instruction: "Create a 3x2 grid with equal column widths",
            initialCode: ".grid-container {\n  /* Add your CSS here */\n}",
            solution: ".grid-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 100px 100px;\n}"
          }
        ])
      },
      {
        id: "grid-2",
        title: "Grid Areas & Lines",
        description: "Understanding grid lines and how to place items",
        module: "grid",
        order: 2,
        duration: 7,
        difficulty: "beginner",
        content: JSON.stringify({
          introduction: "Grid lines are the dividing lines that make up the structure of the grid.",
          keyPoints: [
            "Grid lines are numbered starting from 1",
            "Use grid-column and grid-row to position items",
            "Negative numbers count from the end"
          ],
          codeExample: ".item {\n  grid-column: 1 / 3;\n  grid-row: 2 / 4;\n}"
        }),
        exercises: JSON.stringify([
          {
            instruction: "Place an item spanning from column 2 to 4 and row 1 to 2",
            initialCode: ".grid-item {\n  /* Add your CSS here */\n}",
            solution: ".grid-item {\n  grid-column: 2 / 4;\n  grid-row: 1 / 2;\n}"
          }
        ])
      },
      {
        id: "grid-3",
        title: "Auto-placement",
        description: "How grid automatically places items",
        module: "grid",
        order: 3,
        duration: 6,
        difficulty: "beginner",
        content: JSON.stringify({
          introduction: "Grid automatically places items that don't have explicit positions.",
          keyPoints: [
            "Items flow in row direction by default",
            "Use grid-auto-flow to change direction",
            "Auto-placement fills empty spaces"
          ],
          codeExample: ".container {\n  grid-auto-flow: column;\n  grid-auto-columns: 1fr;\n}"
        }),
        exercises: JSON.stringify([
          {
            instruction: "Set auto-flow to column direction",
            initialCode: ".grid-container {\n  display: grid;\n  /* Add auto-flow property */\n}",
            solution: ".grid-container {\n  display: grid;\n  grid-auto-flow: column;\n}"
          }
        ])
      },
      {
        id: "grid-4",
        title: "Grid Template Areas",
        description: "Learn how to create named grid areas for semantic layout control",
        module: "grid",
        order: 4,
        duration: 8,
        difficulty: "intermediate",
        content: JSON.stringify({
          introduction: "Grid template areas allow you to name sections of your grid layout, making it easier to understand and maintain.",
          keyPoints: [
            "Named areas make your CSS more readable and maintainable",
            "The string format visually represents your grid layout",
            "Easy to rearrange layout by modifying the template areas string"
          ],
          codeExample: ".container {\n  display: grid;\n  grid-template-areas:\n    \"header header header\"\n    \"sidebar main main\"\n    \"footer footer footer\";\n  grid-template-rows: auto 1fr auto;\n  grid-template-columns: 200px 1fr 1fr;\n}\n\n.header { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main { grid-area: main; }\n.footer { grid-area: footer; }"
        }),
        exercises: JSON.stringify([
          {
            instruction: "Create a layout with header, sidebar, main content, and footer using grid-template-areas",
            initialCode: ".grid-container {\n  display: grid;\n  /* Add template areas */\n}\n\n.header { /* Add grid-area */ }\n.sidebar { /* Add grid-area */ }\n.main { /* Add grid-area */ }\n.footer { /* Add grid-area */ }",
            solution: ".grid-container {\n  display: grid;\n  grid-template-areas:\n    \"header header header\"\n    \"sidebar main main\"\n    \"footer footer footer\";\n  grid-template-rows: auto 1fr auto;\n  grid-template-columns: 200px 1fr 1fr;\n}\n\n.header { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main { grid-area: main; }\n.footer { grid-area: footer; }"
          }
        ])
      },
      // Flexbox lessons
      {
        id: "flex-1",
        title: "Flex Container Basics",
        description: "Introduction to flexbox and flex containers",
        module: "flexbox",
        order: 1,
        duration: 5,
        difficulty: "beginner",
        content: JSON.stringify({
          introduction: "Flexbox is a one-dimensional layout method for laying out items in rows or columns.",
          keyPoints: [
            "Use display: flex to create a flex container",
            "Flex items are direct children of flex containers",
            "Main axis and cross axis determine layout direction"
          ],
          codeExample: ".flex-container {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n}"
        }),
        exercises: JSON.stringify([
          {
            instruction: "Create a flex container with items centered both horizontally and vertically",
            initialCode: ".flex-container {\n  /* Add your CSS here */\n}",
            solution: ".flex-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}"
          }
        ])
      },
      // Position lessons
      {
        id: "position-1",
        title: "Static and Relative Positioning",
        description: "Understanding default positioning and relative positioning",
        module: "position",
        order: 1,
        duration: 6,
        difficulty: "beginner",
        content: JSON.stringify({
          introduction: "CSS positioning controls how elements are positioned in the document flow.",
          keyPoints: [
            "Static is the default position value",
            "Relative positioning moves element relative to its normal position",
            "Relative positioned elements maintain their space in the document flow"
          ],
          codeExample: ".relative-item {\n  position: relative;\n  top: 20px;\n  left: 30px;\n}"
        }),
        exercises: JSON.stringify([
          {
            instruction: "Move an element 20px down and 15px right using relative positioning",
            initialCode: ".positioned-element {\n  /* Add positioning CSS */\n}",
            solution: ".positioned-element {\n  position: relative;\n  top: 20px;\n  left: 15px;\n}"
          }
        ])
      }
    ];

    lessons.forEach(lesson => {
      this.lessons.set(lesson.id, lesson);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Lesson methods
  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).sort((a, b) => a.order - b.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async getLessonsByModule(module: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.module === module)
      .sort((a, b) => a.order - b.order);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = randomUUID();
    const lesson: Lesson = { ...insertLesson, id };
    this.lessons.set(id, lesson);
    return lesson;
  }

  // Module methods
  async getModules(): Promise<Module[]> {
    return Array.from(this.modules.values()).sort((a, b) => a.order - b.order);
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const id = randomUUID();
    const module: Module = { ...insertModule, id };
    this.modules.set(id, module);
    return module;
  }

  // Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserProgressForLesson(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      progress => progress.userId === userId && progress.lessonId === lessonId
    );
  }

  async createOrUpdateProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const existingKey = Array.from(this.userProgress.entries()).find(
      ([_, progress]) => progress.userId === insertProgress.userId && progress.lessonId === insertProgress.lessonId
    );

    if (existingKey) {
      const [id, existing] = existingKey;
      const updated: UserProgress = {
        ...existing,
        ...insertProgress,
        completedAt: insertProgress.completed ? new Date() : existing.completedAt,
      };
      this.userProgress.set(id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const progress: UserProgress = {
        ...insertProgress,
        id,
        completed: insertProgress.completed ?? false,
        completedAt: insertProgress.completed ? new Date() : null,
        codeSubmissions: insertProgress.codeSubmissions ?? null,
      };
      this.userProgress.set(id, progress);
      return progress;
    }
  }
}

export const storage = new MemStorage();
