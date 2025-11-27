export const calculatePaginationData = (
  total,
  page,
  perPage
) => {
  const totalContactsCount = total;
  const totalPages = Math.ceil(
    totalContactsCount / perPage
  );
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    "CurrentPage :": page,
    "Total pages :": totalPages,
    "Contacts per Page :": perPage,
    "Total Contacts Count :": totalContactsCount,
    "Has Previous Page :": hasPreviousPage,
    "Has Next Page :": hasNextPage,
  };
};
