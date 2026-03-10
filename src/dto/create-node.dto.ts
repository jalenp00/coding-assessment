import { IsOptional, IsString, IsInt } from 'class-validator'

export class CreateNodeDto {
  @IsString()
  label: string

  @IsOptional()
  @IsInt()
  parentId?: number
}