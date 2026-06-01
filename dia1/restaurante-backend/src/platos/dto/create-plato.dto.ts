import { IsString, IsNumber, IsBoolean, IsOptional, MinLength, IsPositive } from 'class-validator';

export class CreatePlatoDto {
  @IsString()
  @MinLength(1)
  nombre!: string;

  @IsNumber()
  @IsPositive()
  precio!: number;

  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
}
