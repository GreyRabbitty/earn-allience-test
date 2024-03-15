import * as _ from 'lodash';
import * as seedrandom from 'seedrandom';

import {
  bezierGenerator,
  BezierParams,
  easeInOutSine,
  easeInSine,
  easeOutSine,
  EasingFunction,
  EasingFunctionParams,
} from './easing.helper';

export function random(seed?: string): number {
  if (typeof seed === 'string') {
    return seedrandom(seed)();
  }
  return Math.random();
}

export function randomFromRange(
  min: number,
  max: number,
  f?: (x: number) => number,
) {
  const difference = max - min;
  const rand = random();
  const _f = f || ((x: number) => x);
  return min + _f(rand) * difference;
}

export function randomSuccess(successRate: number) {
  if (successRate < 0 || successRate > 1) {
    throw new Error('success rate is out of range');
  }

  return random() <= successRate;
}

export function weightedPick<T extends string>(
  itemWeights: Record<string, number>,
  seed?: string,
): T {
  const entries: { value: string; weight: number }[] = Object.entries<number>(
    itemWeights,
  ).map((i) => ({
    value: i[0],
    weight: i[1],
  }));

  return weightedPickArray<string>(entries, seed) as T;
}

export function weightedPickArray<T>(
  itemWeights: { value: T; weight: number }[],
  seed?: string,
): T {
  const totalWeight = _.sum(itemWeights.map((i) => i.weight));
  let rand = random(seed) * totalWeight;
  for (const item of itemWeights) {
    rand -= item.weight;
    if (rand < 0) {
      return item.value;
    }
  }

  throw new Error('prob does not add up');
}

export function absolutePick<T extends string | number | symbol>(
  itemWeights: Record<T, number>,
): T | null {
  let rand = random();
  for (const item in itemWeights) {
    rand -= itemWeights[item];
    if (rand < 0) {
      return item;
    }
  }

  return null;
}

export function randomPickFromArray<T = any>(input: T[]) {
  return input[Math.floor(randomFromRange(0, input.length))];
}

export function percentToProb(percent: number) {
  return percent / 100;
}

export function randomString(
  length: number,
  charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
): string {
  let str = '';
  const len = charset.length;
  for (let i = 0; i < length; i++) {
    str += charset.charAt(Math.floor(random() * len));
  }
  return str;
}

export const transformedRandomValue = (
  min: number,
  max: number,
  f: EasingFunction,
  params?: EasingFunctionParams,
) => {
  switch (f) {
    case EasingFunction.EASE_IN_SINE:
      return randomFromRange(min, max, easeInSine);
    case EasingFunction.EASE_OUT_SINE:
      return randomFromRange(min, max, easeOutSine);
    case EasingFunction.EASE_IN_OUT_SINE:
      return randomFromRange(min, max, easeInOutSine);
    case EasingFunction.BEZIER:
      return randomFromRange(min, max, bezierGenerator(params as BezierParams));
    default:
      return randomFromRange(min, max);
  }
};
