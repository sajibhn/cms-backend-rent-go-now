import { IsObject, IsOptional, IsString } from "class-validator";
import { Point } from "geojson";

export class CreateApartmentDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  location: Point;

  @IsString()
  url: string;

  @IsString()
  neighborhoodId: string;
}
