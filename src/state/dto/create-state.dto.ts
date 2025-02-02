import { IsString, IsOptional, IsObject } from 'class-validator';
import { Point } from 'geojson';

export class CreateStateDto {
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsObject()
	location: Point;

	@IsString()
	url: string;
}
