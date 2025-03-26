import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { LifelineService } from './lifeline.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
@ApiTags('Lifelines') // Group endpoints under "lifelines" in Swagger UI
@Controller('game-sessions/:sessionId/lifelines')
export class LifelineController {
  constructor(private readonly lifelineService: LifelineService) {}

  // Check available lifelines
  @Get()
  @ApiOperation({ summary: 'Check lifelines' })
  @ApiResponse({
    status: 200,
    description: 'Fetch lifelines for a game session',
    isArray: true,
  })
  checkLifelines(@Param('sessionId') sessionId: number) {
    const lifelines = this.lifelineService.checkLifelines(sessionId);
    return {
      success: true,
      data: lifelines,
    };
  }

  // Use 50/50 lifeline
  @Post('fifty-fifty')
  useFiftyFifty(
    @Param('sessionId') sessionId: number,
    @Body('questionId') questionId: number,
  ) {
    const remainingOptions = this.lifelineService.useFiftyFifty(
      sessionId,
      questionId,
    );
    return {
      success: true,
      data: remainingOptions,
    };
  }

  // Use hint lifeline
  @Post('hint')
  useHint(
    @Param('sessionId') sessionId: number,
    @Body('questionId') questionId: number,
  ) {
    const hint = this.lifelineService.useAskFriend(sessionId, questionId);
    return {
      success: true,
      data: hint,
    };
  }
}
