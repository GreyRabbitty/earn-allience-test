import { ValidateNested } from 'class-validator';

export class HasuraCronEventPayloadDto<T = any> {
  id: string;
  name: string;
  scheduled_time: string;
  @ValidateNested()
  payload: T;
}
