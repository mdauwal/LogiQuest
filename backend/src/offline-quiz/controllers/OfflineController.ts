import { Controller, Get, Post, Put, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuizService } from '../services/quiz.service';
import { SyncService } from '../services/sync.service';
import { UserProgressService } from '../services/user-progress.service';

@Controller('offline')
export class OfflineController {
  constructor(
    private readonly quizService: QuizService,
    private readonly syncService: SyncService,
    private readonly userProgressService: UserProgressService,
  ) {}

  /**
   * Endpoint for downloading a quiz for offline use
   */
  @Post('quizzes/:id/offline')
  @UseGuards(AuthGuard('jwt'))
  async downloadQuizForOffline(@Param('id') quizId: string, @Req() request) {
    const userId = request.user.id;
    
    // Get quiz data with all necessary details for offline use
    const quiz = await this.quizService.getQuizWithQuestionsForOffline(quizId);
    
    // Track that this quiz was downloaded for offline use
    await this.syncService.trackOfflineDownload(userId, quizId);
    
    return {
      ...quiz,
      downloadedAt: Date.now(),
      // Set expiration date (optional) - e.g., 30 days from now
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000),
    };
  }

  /**
   * Endpoint for checking sync status
   */
  @Get('sync/status')
  @UseGuards(AuthGuard('jwt'))
  async getSyncStatus(@Req() request) {
    const userId = request.user.id;
    return this.syncService.getUserSyncStatus(userId);
  }

  /**
   * Endpoint for manually triggering synchronization
   */
  @Post('sync')
  @UseGuards(AuthGuard('jwt'))
  async triggerSync(@Req() request, @Body() syncData: any) {
    const userId = request.user.id;
    return this.syncService.processUserSyncRequest(userId, syncData);
  }

  /**
   * Endpoint for getting quiz progress
   */
  @Get('quizzes/:id/progress')
  @UseGuards(AuthGuard('jwt'))
  async getQuizProgress(@Param('id') quizId: string, @Req() request) {
    const userId = request.user.id;
    return this.userProgressService.getQuizProgress(userId, quizId);
  }

  /**
   * Endpoint for updating quiz progress
   */
  @Put('quizzes/:id/progress')
  @UseGuards(AuthGuard('jwt'))
  async updateQuizProgress(
    @Param('id') quizId: string, 
    @Body() progressData: any,
    @Req() request
  ) {
    const userId = request.user.id;
    return this.userProgressService.updateQuizProgress(userId, quizId, progressData);
  }
}