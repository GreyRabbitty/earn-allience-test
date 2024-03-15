import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { getLoggerToken } from 'nestjs-pino';
import { DataSource, EntityManager, ObjectType, Repository } from 'typeorm';

import {
  dataSourceMockFactory,
  repositoryMockFactory,
} from '@app/common/mocks';
import { entityManagerMockFactory } from '@app/common/mocks/entity-manager-mock-factory';
import { factory } from '@app/factory/helpers';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

export function mockRepositoryProviders(
  entities: EntityClassOrSchema[],
): Provider[] {
  return entities.map((entity) => ({
    provide: getRepositoryToken(entity),
    useFactory: repositoryMockFactory,
  }));
}

export function mockDataSourceProviders(): Provider {
  return {
    provide: DataSource,
    useFactory: dataSourceMockFactory,
  };
}

export function mockEntityManagerProvider(): Provider {
  return {
    provide: EntityManager,
    useFactory: entityManagerMockFactory,
  };
}

export function mockLoggerProviders(
  classes: ClassConstructor<any>[],
): Provider[] {
  return classes.map((cls) => ({
    provide: getLoggerToken(cls.name),
    useFactory: repositoryMockFactory,
  }));
}

export function getMockRepository<T extends EntityClassOrSchema>(
  module: TestingModule,
  entity: T,
): MockType<Repository<T>> {
  return module.get(getRepositoryToken(entity));
}

export function typecast<T, V>(cls: ClassConstructor<T>, plain: V[]): T[];
export function typecast<T, V>(cls: ClassConstructor<T>, plain: V): T;
export function typecast<T, V>(
  cls: ClassConstructor<T>,
  obj: V | V[],
): T | T[] {
  return plainToInstance(cls, obj);
}

export async function make<T>(cls: ObjectType<T>, data: Partial<T>): Promise<T>;
export async function make<T>(
  cls: ObjectType<T>,
  data: Partial<T>[],
): Promise<T[]>;
export async function make<T>(
  cls: ObjectType<T>,
  data: Partial<T> | Partial<T>[] = {},
): Promise<T | T[]> {
  if (!Array.isArray(data)) {
    return await factory(cls).make(data);
  }

  return await Promise.all(data.map((d) => factory(cls).make(d)));
}
