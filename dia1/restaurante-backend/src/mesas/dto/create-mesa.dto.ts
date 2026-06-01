import { IsNumber, IsPositive, IsOptional, IsEnum, Min } from 'class-validator';
import { MesaEstado } from '../entities/mesa.entity';

export class CreateMesaDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  numero!: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  capacidad!: number;

  @IsEnum(MesaEstado)
  @IsOptional()
  estado?: MesaEstado;
}
