import { DataSource } from 'typeorm';

import { MockType } from '@app/common/helpers/test.helper';

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(
  () => ({
    transaction: jest.fn(),
    getRepository: jest.fn(),
    // ...
  }),
);
