import {IsIn, IsNotEmpty,IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export const AVAILABILITY_STATUS = ['available', 'unavailable'] as const;

export class UpdateAvailabilityDto {
    @ApiProperty({ enum: AVAILABILITY_STATUS, example: 'available' })
    @IsString()
    @IsNotEmpty()
    @IsIn(AVAILABILITY_STATUS)
    availability_status: (typeof AVAILABILITY_STATUS)[number];    
}