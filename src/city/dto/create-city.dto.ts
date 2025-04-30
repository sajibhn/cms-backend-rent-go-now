import { IsString, IsOptional, IsObject, IsArray } from 'class-validator';
import { Point } from 'geojson';

export class CreateCityDto {

	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsObject()
	location: Point;

	@IsString()
	url: string;

	@IsString()
	stateId: string;

	@IsArray()
	media: string[];
}
