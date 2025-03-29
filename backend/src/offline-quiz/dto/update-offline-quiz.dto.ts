import { PartialType } from '@nestjs/swagger';
import { CreateOfflineQuizDto } from './create-offline-quiz.dto';

export class UpdateOfflineQuizDto extends PartialType(CreateOfflineQuizDto) {}
