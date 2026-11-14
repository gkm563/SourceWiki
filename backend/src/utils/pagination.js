export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

/**
 * Parses and sanitizes page and limit pagination query parameters.
 * Clamps limit to a maximum to prevent unbounded database queries,
 * and ensures page/limit default to sane values when missing, non-positive,
 * or non-numeric.
 *
 * @param {object} [query={}] - Request query object (e.g. req.query)
 * @param {number} [defaultLimit=DEFAULT_LIMIT] - Fallback limit (default 20)
 * @param {number} [maxLimit=MAX_LIMIT] - Maximum allowed limit (default 100)
 * @returns {{ page: number, limit: number, offset: number }}
 */
export const paginate = (query = {}, defaultLimit = DEFAULT_LIMIT, maxLimit = MAX_LIMIT) => {
  const rawPage = parseInt(query?.page, 10);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : DEFAULT_PAGE;

  const rawLimit = parseInt(query?.limit, 10);
  const baseLimit = Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : defaultLimit;
  const limit = Math.min(baseLimit, maxLimit);

  const offset = (page - 1) * limit;

  return { page, limit, offset };
};
