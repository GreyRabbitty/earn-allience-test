import { HasuraSession } from '@app/hasura/decorators/hasura-session.decorator';

export const HasuraUserId = ({
  isOptional = false,
}: { isOptional?: boolean } = {}): ParameterDecorator => {
  return HasuraSession('x-hasura-user-id', isOptional);
};
