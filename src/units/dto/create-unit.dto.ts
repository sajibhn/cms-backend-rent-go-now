import {
	IsString,
	IsNumber,
	IsBoolean,
	IsOptional,
	IsPositive,
	IsNotEmpty,
	IsArray,
} from 'class-validator';

export class CreateUnitDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@IsPositive()
	bedrooms: number;

	@IsNumber()
	@IsPositive()
	bathrooms: number;

	@IsNumber()
	@IsPositive()
	floorArea: number;

	@IsNumber()
	@IsPositive()
	price: number;

	@IsNumber()
	@IsPositive()
	minLeaseMonths: number;

	@IsNumber()
	@IsPositive()
	minRentPeriod: number;

	@IsString()
	@IsNotEmpty()
	contact: string;

	@IsString()
	@IsNotEmpty()
	amenities: string;

	@IsString()
	@IsNotEmpty()
	facilities: string;

	@IsBoolean()
	isFullyFurnished: boolean;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsNotEmpty()
	apartmentId: string;

	@IsArray()
	media: string[];
}