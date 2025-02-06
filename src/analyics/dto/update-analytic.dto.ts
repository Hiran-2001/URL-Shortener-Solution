import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalyicDto } from './create-analytic.dto';

export class UpdateAnalyicDto extends PartialType(CreateAnalyicDto) {}
