import { IsString, IsOptional, IsObject, IsArray } from 'class-validator';
import { Point } from 'geojson';

export class CreateStateDto {
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsObject()
	location: Point;

	@IsArray()
	media: string[];

	@IsString()
	url: string;
}
