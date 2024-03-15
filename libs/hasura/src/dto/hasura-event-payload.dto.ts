import { ApiProperty } from '@nestjs/swagger';

/**
 * Ref: https://hasura.io/docs/latest/event-triggers/payload/
 */

class EventData<T> {
  @ApiProperty({
    description: 'Key-value pairs of column name and their values of the table',
  })
  new: T;

  @ApiProperty({
    description: 'Key-value pairs of column name and their values of the table',
  })
  old: T;
}

class EventTrigger {
  @ApiProperty()
  name: string;
}

class Event<T> {
  @ApiProperty({
    description:
      'Key-value pairs of session variables (i.e. "x-hasura-*" variables) and their values (NULL if no session variables found)',
  })
  session_variables: object;

  @ApiProperty({
    description:
      'Name of the operation. Can only be "INSERT", "UPDATE", "DELETE", "MANUAL"',
  })
  op: 'INSERT' | 'UPDATE' | 'DELETE' | 'MANUAL';

  @ApiProperty()
  data: EventData<T>;
}

export class HasuraEventPayloadDto<T> {
  @ApiProperty({
    description: 'UUID identifier for the Hasura event',
  })
  id: string;

  @ApiProperty({
    description: 'Timestamp at which event was created',
  })
  created_at: string;

  @ApiProperty()
  trigger: EventTrigger;

  @ApiProperty()
  event: Event<T>;
}
