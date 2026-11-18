import {IsUrl, 
        IsNotEmpty, 
       } from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class UpdateLandImageDto {
    @ApiProperty({ example:'https://example.com/images/north-field-2.jpg' })
    @IsUrl({}, { message: 'image_url must be a valid URL' })
    @IsNotEmpty()
    image_url: string;

}