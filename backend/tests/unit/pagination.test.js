import { paginate, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '../../src/utils/pagination.js';

describe('paginate helper', () => {
  it('should return default page, limit, and offset when query is empty or undefined', () => {
    expect(paginate()).toEqual({ page: 1, limit: 20, offset: 0 });
    expect(paginate({})).toEqual({ page: 1, limit: 20, offset: 0 });
    expect(paginate(null)).toEqual({ page: 1, limit: 20, offset: 0 });
  });

  it('should parse valid page and limit numbers from query string', () => {
    expect(paginate({ page: '1', limit: '10' })).toEqual({ page: 1, limit: 10, offset: 0 });
    expect(paginate({ page: '2', limit: '15' })).toEqual({ page: 2, limit: 15, offset: 15 });
    expect(paginate({ page: '5', limit: '20' })).toEqual({ page: 5, limit: 20, offset: 80 });
  });

  it('should clamp limit to MAX_LIMIT (100) when requested limit is too high', () => {
    expect(paginate({ limit: '1000000' })).toEqual({ page: 1, limit: 100, offset: 0 });
    expect(paginate({ limit: '101' })).toEqual({ page: 1, limit: 100, offset: 0 });
    expect(paginate({ page: '3', limit: '500' })).toEqual({ page: 3, limit: 100, offset: 200 });
  });

  it('should allow limit up to exactly MAX_LIMIT', () => {
    expect(paginate({ limit: '100' })).toEqual({ page: 1, limit: 100, offset: 0 });
  });

  it('should respect custom defaultLimit and maxLimit parameters', () => {
    expect(paginate({}, 50, 200)).toEqual({ page: 1, limit: 50, offset: 0 });
    expect(paginate({ limit: '150' }, 50, 120)).toEqual({ page: 1, limit: 120, offset: 0 });
  });

  it('should fall back to sane defaults for non-positive numbers', () => {
    expect(paginate({ page: '0', limit: '0' })).toEqual({ page: 1, limit: 20, offset: 0 });
    expect(paginate({ page: '-5', limit: '-20' })).toEqual({ page: 1, limit: 20, offset: 0 });
  });

  it('should fall back to sane defaults for non-numeric input', () => {
    expect(paginate({ page: 'abc', limit: 'xyz' })).toEqual({ page: 1, limit: 20, offset: 0 });
    expect(paginate({ page: '', limit: '' })).toEqual({ page: 1, limit: 20, offset: 0 });
    expect(paginate({ page: null, limit: undefined })).toEqual({ page: 1, limit: 20, offset: 0 });
  });

  it('should export standard pagination constants', () => {
    expect(DEFAULT_PAGE).toBe(1);
    expect(DEFAULT_LIMIT).toBe(20);
    expect(MAX_LIMIT).toBe(100);
  });
});
