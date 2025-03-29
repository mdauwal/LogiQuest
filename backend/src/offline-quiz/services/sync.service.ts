import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSyncStatus } from '../entities/user-sync-status.entity';
import { OfflineDownload } from '../entities/offline-download.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(UserSyncStatus)
    private userSyncStatusRepository: Repository<UserSyncStatus>,
    
    @InjectRepository(OfflineDownload)
    private offlineDownloadRepository: Repository<OfflineDownload>,
  ) {}

  /**
   * Track that a user downloaded a quiz for offline use
   */
  async trackOfflineDownload(userId: string, quizId: string): Promise<OfflineDownload> {
    const download = new OfflineDownload();
    download.userId = userId;
    download.quizId = quizId;
    download.downloadedAt = new Date();
    
    return this.offlineDownloadRepository.save(download);
  }

  /**
   * Get user's sync status
   */
  async getUserSyncStatus(userId: string): Promise<UserSyncStatus> {
    let status = await this.userSyncStatusRepository.findOne({ where: { userId } });
    
    if (!status) {
      // Create initial status record if it doesn't exist
      status = new UserSyncStatus();
      status.userId = userId;
      status.lastSyncAt = null;
      status.pendingActions = 0;
      status = await this.userSyncStatusRepository.save(status);
    }
    
    return status;
  }

  /**
   * Process user's sync request, handling conflicts
   */
  async processUserSyncRequest(userId: string, syncData: any): Promise<any> {
    // Update user's sync status
    const status = await this.getUserSyncStatus(userId);
    status.lastSyncAt = new Date();
    await this.userSyncStatusRepository.save(status);
    
    // Process any pending actions from the client
    // Here you would implement the logic to process the syncData
    // including any conflict resolution
    
    return {
      status: 'success',
      lastSyncAt: status.lastSyncAt,
      // Include any data that needs to be sent back to the client
    };
  }
}
