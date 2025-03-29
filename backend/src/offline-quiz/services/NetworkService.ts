export class NetworkService {
    private onlineStatus: boolean;
    private onStatusChangeCallbacks: ((status: boolean) => void)[] = [];
  
    constructor() {
      this.onlineStatus = navigator.onLine;
      
      // Set up event listeners for online/offline events
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
    }
  
    /**
     * Check if the device is currently online
     */
    public isOnline(): boolean {
      return this.onlineStatus;
    }
  
    /**
     * Register a callback for when online status changes
     */
    public onStatusChange(callback: (status: boolean) => void): void {
      this.onStatusChangeCallbacks.push(callback);
    }
  
    /**
     * Remove a previously registered callback
     */
    public removeStatusChangeCallback(callback: (status: boolean) => void): void {
      this.onStatusChangeCallbacks = this.onStatusChangeCallbacks.filter(cb => cb !== callback);
    }
  
    /**
     * Test connection by pinging a server endpoint
     * Useful for detecting poor or limited connectivity
     */
    public async testConnection(): Promise<boolean> {
      if (!this.onlineStatus) {
        return false;
      }
      
      try {
        // Use a lightweight endpoint that returns quickly
        const response = await fetch('/api/ping', {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' },
          // Short timeout to quickly detect poor connections
          signal: AbortSignal.timeout(3000)
        });
        
        return response.ok;
      } catch (error) {
        console.warn('Connection test failed:', error);
        return false;
      }
    }
  
    private handleOnline(): void {
      this.onlineStatus = true;
      this.notifyStatusChange();
    }
  
    private handleOffline(): void {
      this.onlineStatus = false;
      this.notifyStatusChange();
    }
  
    private notifyStatusChange(): void {
      for (const callback of this.onStatusChangeCallbacks) {
        callback(this.onlineStatus);
      }
    }
  }
  
  export const networkService = new NetworkService();