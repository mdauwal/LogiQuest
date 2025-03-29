export interface QuizData {
    id: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
    downloadedAt: number;
    expiresAt?: number;
  }
  
  export interface QuizQuestion {
    id: string;
    text: string;
    options: {
      id: string;
      text: string;
      isCorrect: boolean;
    }[];
  }
  
  export interface UserProgress {
    quizId: string;
    answers: {
      questionId: string;
      selectedOptionId: string;
      answeredAt: number;
    }[];
    completed: boolean;
    score?: number;
    lastUpdated: number;
  }
  
  export interface PendingAction {
    id: string;
    type: 'SUBMIT_ANSWER' | 'COMPLETE_QUIZ' | 'UPDATE_PROFILE';
    data: any;
    timestamp: number;
    retryCount: number;
  }
  
  export class LocalStorageService {
    private static QUIZZES_KEY = 'offline_quizzes';
    private static PROGRESS_KEY = 'offline_progress';
    private static PENDING_ACTIONS_KEY = 'offline_pending_actions';
    
    // Save a quiz for offline use
    public saveQuiz(quiz: QuizData): void {
      const quizzes = this.getQuizzes();
      const existingIndex = quizzes.findIndex(q => q.id === quiz.id);
      
      if (existingIndex >= 0) {
        quizzes[existingIndex] = quiz;
      } else {
        quizzes.push(quiz);
      }
      
      localStorage.setItem(LocalStorageService.QUIZZES_KEY, JSON.stringify(quizzes));
    }
    
    // Get all cached quizzes
    public getQuizzes(): QuizData[] {
      const data = localStorage.getItem(LocalStorageService.QUIZZES_KEY);
      return data ? JSON.parse(data) : [];
    }
    
    // Get a specific quiz by ID
    public getQuiz(quizId: string): QuizData | null {
      const quizzes = this.getQuizzes();
      return quizzes.find(quiz => quiz.id === quizId) || null;
    }
    
    // Remove a quiz from cache
    public removeQuiz(quizId: string): void {
      const quizzes = this.getQuizzes().filter(quiz => quiz.id !== quizId);
      localStorage.setItem(LocalStorageService.QUIZZES_KEY, JSON.stringify(quizzes));
    }
    
    // Save user progress for a quiz
    public saveProgress(progress: UserProgress): void {
      const allProgress = this.getAllProgress();
      const existingIndex = allProgress.findIndex(p => p.quizId === progress.quizId);
      
      if (existingIndex >= 0) {
        allProgress[existingIndex] = progress;
      } else {
        allProgress.push(progress);
      }
      
      localStorage.setItem(LocalStorageService.PROGRESS_KEY, JSON.stringify(allProgress));
    }
    
    // Get progress for all quizzes
    public getAllProgress(): UserProgress[] {
      const data = localStorage.getItem(LocalStorageService.PROGRESS_KEY);
      return data ? JSON.parse(data) : [];
    }
    
    // Get progress for a specific quiz
    public getQuizProgress(quizId: string): UserProgress | null {
      const allProgress = this.getAllProgress();
      return allProgress.find(progress => progress.quizId === quizId) || null;
    }
    
    // Add a pending action to the queue
    public addPendingAction(action: Omit<PendingAction, 'id' | 'retryCount'>): void {
      const pendingActions = this.getPendingActions();
      const newAction: PendingAction = {
        ...action,
        id: this.generateUniqueId(),
        retryCount: 0
      };
      
      pendingActions.push(newAction);
      localStorage.setItem(LocalStorageService.PENDING_ACTIONS_KEY, JSON.stringify(pendingActions));
    }
    
    // Get all pending actions
    public getPendingActions(): PendingAction[] {
      const data = localStorage.getItem(LocalStorageService.PENDING_ACTIONS_KEY);
      return data ? JSON.parse(data) : [];
    }
    
    // Remove a pending action
    public removePendingAction(actionId: string): void {
      const pendingActions = this.getPendingActions().filter(action => action.id !== actionId);
      localStorage.setItem(LocalStorageService.PENDING_ACTIONS_KEY, JSON.stringify(pendingActions));
    }
    
    // Update retry count for a pending action
    public incrementRetryCount(actionId: string): void {
      const pendingActions = this.getPendingActions();
      const actionIndex = pendingActions.findIndex(action => action.id === actionId);
      
      if (actionIndex >= 0) {
        pendingActions[actionIndex].retryCount += 1;
        localStorage.setItem(LocalStorageService.PENDING_ACTIONS_KEY, JSON.stringify(pendingActions));
      }
    }
    
    // Clear all locally stored data
    public clearAll(): void {
      localStorage.removeItem(LocalStorageService.QUIZZES_KEY);
      localStorage.removeItem(LocalStorageService.PROGRESS_KEY);
      localStorage.removeItem(LocalStorageService.PENDING_ACTIONS_KEY);
    }
    
    // Generate a unique ID for pending actions
    private generateUniqueId(): string {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
  }
  
  export const localStorageService = new LocalStorageService();