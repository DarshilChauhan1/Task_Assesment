import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class QueryCustomerDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    search: string;

    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    limit : number;

    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    page : number;
}