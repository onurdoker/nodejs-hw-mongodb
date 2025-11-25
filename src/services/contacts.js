import Contacts from "../db/models/Contacts.js";

export const getContacts = async () => {
  return await Contacts.find();
};

export const getContactsById = async (id) => {
  return await Contacts.findById(id);
};

export const createContact = async (contact) => {
  return await Contacts.create(contact);
};

export const deleteContact = async (contactId) => {
  return await Contacts.findOneAndDelete({ _id: contactId });
};

export const updateContact = async (contactId, updateData) => {
  return await Contacts.findOneAndUpdate({ _id: contactId }, updateData, {
    new: true,
  });
};
