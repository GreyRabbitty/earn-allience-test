import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

/**
 * Ref: https://hasura.io/docs/latest/actions/action-handlers/
 */

export class HasuraActionPayloadDto<T = any> {
  action: {
    name: string;
  };

  @ValidateNested()
  input: T;

  @ApiProperty({
    description:
      'Key-value pairs of session variables (i.e. "x-hasura-*" variables) and their values (NULL if no session variables found)',
  })
  session_variables: object;
  request_query: string;
  created_at: string;
}
