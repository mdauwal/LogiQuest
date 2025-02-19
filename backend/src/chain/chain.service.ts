/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChainService {
  private chains = [
    { id: 1, name: 'Logic Puzzle 1', steps: ['Step1', 'Step2'] },
  ];

  getChains() {
    return this.chains;
  }

  getChainById(id: number) {
    return this.chains.find((chain) => chain.id === id);
  }

  validateChainStep(chainId: number, stepId: number, answer: string) {
    return answer === 'correct';
  }

  getChainHints(chainId: number) {
    return ['Hint 1', 'Hint 2'];
  }
}
