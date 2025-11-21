import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { PetStatus } from '@prisma/client';

export class CreatePetDto {
  @IsString()
  commonName: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  scientificName?: string;

  @IsOptional()
  @IsString()
  shortIntro?: string;

  @IsOptional()
  @IsString()
  background?: string;

  @IsOptional()
  @IsString()
  history?: string;

  @IsOptional()
  @IsString()
  diet?: string;

  @IsOptional()
  @IsString()
  ownershipGuide?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  classifications?: Array<{ type: string; value: string }>;

  @IsOptional()
  @IsEnum(PetStatus)
  status?: PetStatus;
}

