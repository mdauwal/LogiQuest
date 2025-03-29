import { localStorageService, PendingAction, UserProgress } from './LocalStorageService';
import { ApiService } from './ApiService';
import { NetworkService } from './NetworkService';
import { ConflictResolutionService } from './ConflictResolutionService';

export interface SyncStatus {
  lastSyncAttempt: number | null;
  lastSuccessfulSync: number | null;
  pendingActions: number;
  isCurrentlySyncing: boolean;
  error?: string;
}

export class SyncManager {
  private static instance: SyncManager;
  private apiService: ApiService;
  private networkService: NetworkService;
  private conflictResolutionService: ConflictResolutionService;
  private syncStatus: SyncStatus = {
    lastSyncAttempt: null,
    lastSuccessfulSync: null,
    pendingActions: 0,
    isCurrentlySyncing: false
  };
  private syncIntervalId: number | null = null;
  private readonly SYNC_INTERVAL = 30000; // 30 seconds
  private readonly MAX_RETRY_COUNT = 5;

  private constructor() {
    this.apiService = new ApiService();
    this.networkService = new NetworkService();
    this.conflictResolutionService = new ConflictResolutionService();
    
    // Update pending actions count
    this.updatePendingActionsCount();
    
    // Listen for online status changes
    window.addEventListener('online', this.handleOnlineStatusChange.bind(this));
  }

  public static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  // Start background synchronization
  public startBackgroundSync(): void {
    if (this.syncIntervalId === null) {
      this.syncIntervalId = window.setInterval(() => {
        this.syncIfOnline();
      }, this.SYNC_INTERVAL);
      
      // Also attempt an immediate sync if we're online
      this.syncIfOnline();
    }
  }

  // Stop background synchronization
  public stopBackgroundSync(): void {
    if (this.syncIntervalId !== null) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
  }

  // Get current sync status
  public getSyncStatus(): SyncStatus {
    return {
      ...this.syncStatus,
      pendingActions: localStorageService.getPendingActions().length
    };
  }

  // Manually trigger synchronization
  public async manualSync(): Promise<SyncStatus> {
    if (this.syncStatus.isCurrentlySyncing) {
      return this.syncStatus;
    }
    
    return this.performSync();
  }

  // Handle online status change
  private handleOnlineStatusChange(): void {
    if (this.networkService.isOnline()) {
      this.syncIfOnline();
    }
  }

  // Sync if online
  private syncIfOnline(): void {
    if (this.networkService.isOnline() && !this.syncStatus.isCurrentlySyncing) {
      this.performSync();
    }
  }

  // Perform synchronization
  private async performSync(): Promise<SyncStatus> {
    try {
      this.syncStatus.isCurrentlySyncing = true;
      this.syncStatus.lastSyncAttempt = Date.now();
      this.updatePendingActionsCount();
      
      // Process pending actions
      await this.processPendingActions();
      
      // Sync quiz progress
      await this.syncQuizProgress();
      
      // Update successful sync time
      this.syncStatus.lastSuccessfulSync = Date.now();
      this.syncStatus.error = undefined;
      
      return this.syncStatus;
    } catch (error) {
      this.syncStatus.error = error.message;
      throw error;
    } finally {
      this.syncStatus.isCurrentlySyncing = false;
      this.updatePendingActionsCount();
    }
  }

  // Process all pending actions
  private async processPendingActions(): Promise<void> {
    const pendingActions = localStorageService.getPendingActions();
    
    // Sort by timestamp to process oldest first
    pendingActions.sort((a, b) => a.timestamp - b.timestamp);
    
    for (const action of pendingActions) {
      // Skip actions that have exceeded max retry count
      if (action.retryCount >= this.MAX_RETRY_COUNT) {
        // We could implement a notification system here
        localStorageService.removePendingAction(action.id);
        continue;
      }
      
      try {
        await this.processSingleAction(action);
        // If successful, remove the action
        localStorageService.removePendingAction(action.id);
      } catch (error) {
        // Increment retry count
        localStorageService.incrementRetryCount(action.id);
        
        // If network error, abort processing more actions
        if (!this.networkService.isOnline()) {
          throw new Error('Network connection lost during synchronization');
        }
      }
    }
  }

  // Process a single pending action
  private async processSingleAction(action: PendingAction): Promise<void> {
    switch (action.type) {
      case 'SUBMIT_ANSWER':
        await this.apiService.submitAnswer(action.data.quizId, action.data.questionId, action.data.selectedOptionId);
        break;
      case 'COMPLETE_QUIZ':
        await this.apiService.completeQuiz(action.data.quizId, action.data.answers);
        break;
      case 'UPDATE_PROFILE':
        await this.apiService.updateUserProfile(action.data);
        break;
      default:
        console.warn(`Unknown action type: ${(action as any).type}`);
    }
  }

  // Sync quiz progress with server
  private async syncQuizProgress(): Promise<void> {
    const localProgressList = localStorageService.getAllProgress();
    
    for (const localProgress of localProgressList) {
      try {
        // Get server progress
        const serverProgress = await this.apiService.getQuizProgress(localProgress.quizId);
        
        // If there's a conflict, resolve it
        if (serverProgress) {
          const mergedProgress = this.conflictResolutionService.resolveProgressConflict(
            localProgress,
            serverProgress
          );
          
          // If local progress is more recent, update server
          if (mergedProgress.lastUpdated > serverProgress.lastUpdated) {
            await this.apiService.updateQuizProgress(mergedProgress);
          }
          
          // Always update local storage with merged result
          localStorageService.saveProgress(mergedProgress);
        } else {
          // No server progress exists, upload local progress
          await this.apiService.updateQuizProgress(localProgress);
        }
      } catch (error) {
        console.error(`Failed to sync progress for quiz ${localProgress.quizId}:`, error);
        // Continue with other quizzes even if one fails
      }
    }
  }

  // Update pending actions count in sync status
  private updatePendingActionsCount(): void {
    this.syncStatus.pendingActions = localStorageService.getPendingActions().length;
  }
}

export const syncManager = SyncManager.getInstance();