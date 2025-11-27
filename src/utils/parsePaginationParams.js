import { DEFAULT_PAGINATION_VALUES } from "../constants/pagination.js";

const parseNumber = (value, defaultValue) => {
  const parsedValue = Number(value);
  if (!parsedValue) {
    return defaultValue;
  }
  return parsedValue;
};

export const parsePaginationParams = (query) => {
  const page = parseNumber(
    query.page,
    DEFAULT_PAGINATION_VALUES.page
  );
  const perPage = parseNumber(
    query.perPage,
    DEFAULT_PAGINATION_VALUES.perPage
  );

  return { page, perPage };
};
