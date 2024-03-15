import { EntityManager } from 'typeorm';

import { MockType } from '@app/common/helpers/test.helper';

export const entityManagerMockFactory: () => MockType<EntityManager> = jest.fn(
  () => ({
    // ...
  }),
);
