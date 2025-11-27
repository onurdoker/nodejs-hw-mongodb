import {
  DEFAULT_PAGINATION_VALUES,
  SORT_ORDER,
  CONTACTS_SORT_FIELDS,
} from "../constants/pagination.js";

const parseSortOrder = (order) => {
  const knownSortOrders = [SORT_ORDER.ASC, SORT_ORDER.DESC];

  if (knownSortOrders.includes(order)) {
    return order;
  }
  return DEFAULT_PAGINATION_VALUES.sortOrder;
};

const parseSortBy = (sortBy) => {
  if (CONTACTS_SORT_FIELDS.includes(sortBy)) {
    return sortBy;
  }
  return DEFAULT_PAGINATION_VALUES.sortBy;
};

export const parseSortParams = (queryParams) => {
  const sortOrder = parseSortOrder(queryParams.sortOrder);
  const sortBy = parseSortBy(queryParams.sortBy);

  return { sortOrder, sortBy };
};
