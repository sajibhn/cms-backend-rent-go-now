import { IsArray, IsObject, IsOptional, IsString } from "class-validator";
import { Point } from "geojson";

export class CreateNeighborhoodDto {

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
		cityId: string;

		@IsArray()
		media: string[];

}
