import { getContacts, getContactsById, createContact, deleteContact, updateContact } from "../services/contacts.js";
import { httpError } from "../errors/httpError.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { createContactSchema } from "../validators/contacts.js";

export const getContactsController = async (request, response) => {
  const queryParams = request.query;

  const { page, perPage } = parsePaginationParams(queryParams);
  const { sortOrder, sortBy } = parseSortParams(queryParams);
  const filter = parseFilterParams(queryParams);

  const contacts = await getContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
  });

  response.status(200).send({
    message: "Contacts fetched successfully",
    status: 200,
    data: contacts,
  });
};

export const getContactsByIdController = async (request, response) => {
  const { contactId } = request.params;

  const contact = await getContactsById(contactId);

  if (!contact) {
    throw httpError(404, "Contact not found");
  }

  response.status(200).send({
    message: "Contact fetched successfully",
    status: 200,
    data: contact,
  });
};

export const createContactController = async (request, response) => {
  const newContact = request.body;

  try {
    await createContactSchema.validateAsync(newContact, {
      abortEarly: false,
    });
  } catch (error) {
    throw httpError(400, error.details.map((error) => error.message).join(", "));
  }

  const createdContact = await createContact(newContact);

  response.status(201).send({
    message: "Contact created successfully",
    status: 201,
    data: createdContact,
  });
};

export const deleteContactController = async (request, response) => {
  const { contactId } = request.params;

  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    throw httpError(404, "Contact not found");
  }

  response.status(200).send({
    message: "Contact deleted successfully",
    status: 200,
    data: deletedContact,
  });
};

export const updateContactController = async (request, response) => {
  const { contactId } = request.params;
  const updateData = request.body;

  const updatedContact = await updateContact(contactId, updateData);

  if (!updatedContact) {
    throw httpError(404, "Contact not found");
  }

  response.status(200).send({
    message: "Contact updated successfully",
    status: 200,
    data: updatedContact,
  });
};
