import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { LeaderboardsService } from './leaderboards.service';
import { AuthGuard } from 'src/auth/guards/auth.guard'; 
import { ReqUser } from 'src/auth/common/decorator/get-user.decorator'; // custom decorator example
import { User } from 'src/users/entities/user.entity'; // adapt to your user entity

@Controller('api/leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  /**
   * Global leaderboard
   * GET /api/leaderboards/global?period=monthly&page=1&limit=10
   */
  @Get('global')
  async getGlobalLeaderboard(
    @Query('period') period: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.leaderboardsService.getLeaderboard(
      undefined, // no category => global
      period || 'all-time',
      parseInt(page),
      parseInt(limit),
    );
  }

  /**
   * Category-specific leaderboard
   * GET /api/leaderboards/categories/:category?period=weekly&page=1&limit=10
   */
  @Get('categories/:category')
  async getCategoryLeaderboard(
    @Param('category') category: string,
    @Query('period') period: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.leaderboardsService.getLeaderboard(
      category,
      period || 'all-time',
      parseInt(page),
      parseInt(limit),
    );
  }

  /**
   * User ranking lookup
   * GET /api/leaderboards/users/me/rank?period=monthly&category=science
   */
  @Get('users/me/rank')
  @UseGuards(AuthGuard)
  async getUserRank(
    @ReqUser() user: User,
    @Query('period') period: string,
    @Query('category') category: string,
  ) {
    return this.leaderboardsService.getUserRank(
      user,
      category,
      period || 'all-time',
    );
  }
}
