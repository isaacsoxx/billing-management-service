import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TrustDeviceRequestDto {
  @ApiProperty({
    example: 'us-east-2_7a793f1a-cc8c-4182-9120-803d3144da2f',
    description: 'Device key provided by Amplify.',
  })
  @IsString()
  deviceKey: string;
}
