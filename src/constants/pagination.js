export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
};

export const DEFAULT_PAGINATION_VALUES = {
  page: 1,
  perPage: 10,
  sortBy: "_id",
  sortOrder: SORT_ORDER.ASC,
};

export const CONTACTS_SORT_FIELDS = [
  "_id",
  "name",
  "phoneNumber",
  "email",
  "isFavourite",
  "contactType",
  "createdAt",
  "updatedAt",
];
