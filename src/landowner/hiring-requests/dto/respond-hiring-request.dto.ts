import {IsIn} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const RESPONSE_STATUS = [
    'accepted',
    'rejected'
] as const;

export class RespondHiringRequestDto{
    @ApiProperty ({enum: RESPONSE_STATUS, example: 'accepted'})
    @IsIn(RESPONSE_STATUS)
    status: (typeof RESPONSE_STATUS)[number];
}