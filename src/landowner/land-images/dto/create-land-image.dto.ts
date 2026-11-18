import {Type} from 'class-transformer';
import {IsBoolean,
    IsInt,
    IsNotEmpty,
     IsUrl,
     IsPositive} from 'class-validator';
import {ApiProperty,
        ApiPropertyOptional} from '@nestjs/swagger';

export class CreateLandImageDto {
    @ApiProperty({ example:1 })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    land_id: number;

    @ApiProperty({ example:'https://example.com/images/north-field.jpg' })
    @IsUrl({}, { message: 'image_url must be a valid URL' })
    @IsNotEmpty()
    image_url: string;

}