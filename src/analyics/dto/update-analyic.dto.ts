import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalyicDto } from './create-analyic.dto';

export class UpdateAnalyicDto extends PartialType(CreateAnalyicDto) {}
