import { IsOptional, IsString } from "class-validator";

export class CreateUrlDto {
    @IsString()
    longUrl: string;
  
    @IsOptional()
    @IsString()
    customAlias?: string;
  
    @IsOptional()
    @IsString()
    topic?: string;
  }