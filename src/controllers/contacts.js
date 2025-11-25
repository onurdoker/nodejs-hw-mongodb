import { getContacts, getContactsById, createContact, deleteContact, updateContact } from "../services/contacts.js";
import { httpError } from "../errors/httpError.js";

export const getContactsController = async (request, response) => {
  const contacts = await getContacts();

  response.status(200).send({
    message: "Contacts fetched successfully",
    status: 200,
    data: contacts,
  });
};

// eslint-disable-next-line no-unused-vars
export const getContactsByIdController = async (request, response, next) => {
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
