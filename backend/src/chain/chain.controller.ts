/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ChainService } from './chain.service';
@Controller('chains')
export class ChainController {
  constructor(private chainService: ChainService) {}

  @Get()
  getChains() {
    return this.chainService.getChains();
  }

  @Get(':id')
  getChainById(@Param('id') id: number) {
    return this.chainService.getChainById(id);
  }

  @Post(':chainId/validate')
  validateChainStep(
    @Param('chainId') chainId: number,
    @Body() body: { stepId: number; answer: string },
  ) {
    return this.chainService.validateChainStep(
      chainId,
      body.stepId,
      body.answer,
    );
  }
}
