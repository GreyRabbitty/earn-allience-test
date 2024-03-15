import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

/**
 * Ref: https://hasura.io/docs/latest/schema/postgres/input-validations/
 */

class InputValidationInput<T> {
  @ValidateNested()
  input: T[];
}

export class HasuraInputValidationPayloadDto<T = any> {
  @ApiProperty({
    description:
      'Key-value pairs of session variables (i.e. "x-hasura-*" variables) and their values (NULL if no session variables found)',
  })
  session_variables: object;

  @ApiProperty()
  data: InputValidationInput<T>;
}
