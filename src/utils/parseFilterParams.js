export const parseTypeValue = (value) => {
  const typeValue = ["personal", "work", "home"];

  if (typeValue.includes(value)) {
    return value;
  }

  return null;
};

export const parseIsFavoriteValue = (value) => {
  const isFavoriteValue = [true, false];

  if (isFavoriteValue.includes(value)) {
    return value;
  }

  return null;
};

export const parseFilterParams = (queryParams) => {
  const { type, isFavourite } = queryParams;

  const parsedType = parseTypeValue(type);
  const parsedIsFavourite = parseIsFavoriteValue(isFavourite);

  return { type: parsedType, isFavourite: parsedIsFavourite };
};
