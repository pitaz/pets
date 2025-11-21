import { IsOptional, IsString, IsInt, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PetStatus } from '@prisma/client';

export class QueryPetsDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  classification?: string;

  @IsOptional()
  @IsEnum(PetStatus)
  status?: PetStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sort?: 'createdAt' | 'publishedAt' | 'commonName' = 'publishedAt';
}

