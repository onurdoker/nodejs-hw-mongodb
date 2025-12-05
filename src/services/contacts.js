import Contacts from "../db/models/Contacts.js";
import { DEFAULT_PAGINATION_VALUES } from "../constants/pagination.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getContacts = async ({
  userId,
  page = DEFAULT_PAGINATION_VALUES.page,
  perPage = DEFAULT_PAGINATION_VALUES.perPage,
  sortBy = DEFAULT_PAGINATION_VALUES.sortBy,
  sortOrder = DEFAULT_PAGINATION_VALUES.sortOrder,
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const limit = perPage;

  const contactQuery = Contacts.find({ userId });

  if (filter.contactType) {
    contactQuery.where("contactType").equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactQuery.where("isFavourite").equals(filter.isFavourite);
  }

  const totalContactsCount = await Contacts.find().merge(contactQuery).countDocuments();

  const contacts = await contactQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(totalContactsCount, page, perPage);

  return {
    data: contacts,
    paginationData,
  };
};

export const getContactsById = async (id, userId) => {
  return await Contacts.findOne({ _id: id, userId });
};

export const createContact = async (contact) => {
  return await Contacts.create(contact);
};

export const deleteContact = async (contactId, userId) => {
  return await Contacts.findOneAndDelete({
    _id: contactId,
    userId,
  });
};

export const updateContact = async (contactId, updateData, userId) => {
  return await Contacts.findOneAndUpdate({ _id: contactId, userId }, updateData, {
    new: true,
  });
};
