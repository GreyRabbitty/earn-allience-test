import { Roles } from '@app/common/constants';
import { HasuraEventPayloadDto } from '@app/hasura/dto';

export const DEFAULT_ROLES = [Roles.User];

export const getClaims = ({
  userId,
  allowedRoles,
}: {
  userId: string;
  allowedRoles?: string[];
}) => {
  const claim = {
    'https://hasura.io/jwt/claims': {
      // add 'user' to allowed roles and unique the array
      'x-hasura-allowed-roles': [
        ...new Set([...DEFAULT_ROLES, ...(allowedRoles || [])]),
      ],
      'x-hasura-default-role': 'user',
      'x-hasura-user-id': userId,
    },
  };
  return claim;
};

export function hasUpdated<T>(
  payload: HasuraEventPayloadDto<T>,
  key: keyof T,
): boolean {
  const { old: oldData, new: newData } = payload.event.data;

  if (!newData) return false;

  return oldData?.[key] !== newData[key];
}

export function hasUpdatedTo<T, U>(
  payload: HasuraEventPayloadDto<T>,
  key: keyof T,
  value: U,
): boolean {
  if (!hasUpdated(payload, key)) return false;

  return newValue(payload, key) === value;
}

export function newValue<U, T>(
  payload: HasuraEventPayloadDto<T>,
  key: keyof T,
): U {
  const { new: newData } = payload.event.data;

  return newData[key] as U;
}

export function oldValue<U, T>(
  payload: HasuraEventPayloadDto<T>,
  key: keyof T,
): U {
  const { old: oldData } = payload.event.data;

  return oldData[key] as U;
}
