import { UserProgress } from './LocalStorageService';

export class ApiService {
  private readonly BASE_URL = '/api';
  private authToken: string | null = null;

  /**
   * Sets the authentication token for API requests
   */
  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clears the authentication token
   */
  public clearAuthToken(): void {
    this.authToken = null;
  }

  /**
   * Fetches a quiz that will be available offline
   */
  public async fetchQuizForOffline(quizId: string): Promise<any> {
    return this.request(`${this.BASE_URL}/quizzes/${quizId}/offline`, {
      method: 'POST'
    });
  }

  /**
   * Gets the current synchronization status
   */
  public async getSyncStatus(): Promise<any> {
    return this.request(`${this.BASE_URL}/sync/status`);
  }

  /**
   * Manually triggers synchronization
   */
  public async triggerSync(): Promise<any> {
    return this.request(`${this.BASE_URL}/sync`, {
      method: 'POST'
    });
  }

  /**
   * Submits an answer for a quiz question
   */
  public async submitAnswer(quizId: string, questionId: string, selectedOptionId: string): Promise<any> {
    return this.request(`${this.BASE_URL}/quizzes/${quizId}/questions/${questionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ selectedOptionId })
    });
  }

  /**
   * Completes a quiz with all answers
   */
  public async completeQuiz(quizId: string, answers: any[]): Promise<any> {
    return this.request(`${this.BASE_URL}/quizzes/${quizId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  }

  /**
   * Gets quiz progress from the server
   */
  public async getQuizProgress(quizId: string): Promise<UserProgress | null> {
    return this.request(`${this.BASE_URL}/quizzes/${quizId}/progress`);
  }

  /**
   * Updates quiz progress on the server
   */
  public async updateQuizProgress(progress: UserProgress): Promise<any> {
    return this.request(`${this.BASE_URL}/quizzes/${progress.quizId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(progress)
    });
  }

  /**
   * Updates user profile
   */
  public async updateUserProfile(profileData: any): Promise<any> {
    return this.request(`${this.BASE_URL}/user/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  /**
   * Generic request method with authentication handling
   */
  private async request(url: string, options: RequestInit = {}): Promise<any> {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    
    if (this.authToken) {
      headers.set('Authorization', `Bearer ${this.authToken}`);
    }
    
    const requestOptions: RequestInit = {
      ...options,
      headers
    };
    
    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      
      return response.text();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();