import { Repository } from 'typeorm';

import { MockType } from '@app/common/helpers/test.helper';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    findOneBy: jest.fn((entity) => entity),
    findBy: jest.fn(),
    find: jest.fn(),
    // ...
  }),
);
