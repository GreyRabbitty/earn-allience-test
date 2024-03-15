import {
  randomSuccess,
  weightedPick,
  weightedPickArray,
} from './random.helper';
describe('Random Functions Test Suite', () => {
  const randomNumberReturned = 0.2;

  describe(`randomSuccess with return value ${randomNumberReturned}`, () => {
    beforeEach(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(randomNumberReturned);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should not take input > 1', () => {
      expect(() => {
        randomSuccess(1.5);
      }).toThrow('success rate is out of range');
    });
    it('should not take input < 0', () => {
      expect(() => {
        randomSuccess(-0.1);
      }).toThrow('success rate is out of range');
    });
    it(`should return true when input > ${randomNumberReturned}`, () => {
      expect(randomSuccess(0.3)).toBe(true);
    });
    it(`should return true when input = ${randomNumberReturned}`, () => {
      expect(randomSuccess(0.2)).toBe(true);
    });
    it(`should return false when input > ${randomNumberReturned}`, () => {
      expect(randomSuccess(0.19)).toBe(false);
    });
  });

  describe(`weightedPick without seed`, () => {
    const itemWeight = {
      a: 1,
      b: 2,
      c: 3,
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it(`should return a when random = 0.15`, () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.15);
      expect(weightedPick(itemWeight)).toBe('a');
    });

    it(`should return true when random = 0.3`, () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.3);
      expect(weightedPick(itemWeight)).toBe('b');
    });

    it(`should return true when random = 0.6`, () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.6);
      expect(weightedPick(itemWeight)).toBe('c');
    });
  });

  describe(`weightedPick with seed`, () => {
    const itemWeight = {
      a: 1,
      b: 2,
      c: 3,
    };

    it(`should return a when random = 0.15`, () => {
      expect(weightedPick(itemWeight, '4739')).toBe('a');
      expect(weightedPick(itemWeight, '2345')).toBe('b');
      expect(weightedPick(itemWeight, '1697')).toBe('c');
    });
  });

  describe(`weightedPickArray without seed`, () => {
    const itemWeight = [
      { value: 'a', weight: 1 },
      { value: 'b', weight: 2 },
      { value: 'c', weight: 3 },
    ];

    afterEach(() => {
      jest.clearAllMocks();
    });

    it(`should return a when random = 0.15`, () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.15);
      expect(weightedPickArray(itemWeight)).toBe('a');
    });

    it(`should return true when random = 0.3`, () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.3);
      expect(weightedPickArray(itemWeight)).toBe('b');
    });

    it(`should return true when random = 0.6`, () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.6);
      expect(weightedPickArray(itemWeight)).toBe('c');
    });
  });

  describe(`weightedPickArray with seed`, () => {
    const itemWeight = [
      { value: 'a', weight: 1 },
      { value: 'b', weight: 2 },
      { value: 'c', weight: 3 },
    ];

    it(`should return a when random = 0.15`, () => {
      expect(weightedPickArray(itemWeight, '4739')).toBe('a');
      expect(weightedPickArray(itemWeight, '2345')).toBe('b');
      expect(weightedPickArray(itemWeight, '1697')).toBe('c');
    });
  });
});
