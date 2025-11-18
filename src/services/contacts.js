import Contacts from "../db/models/Contacts.js";

const getContacts = async () => {
  const contacts = await Contacts.find();
  return contacts;
};

const getContactsById = async (id) => {
  const contact = await Contacts.findById(id);
  return contact;
};

export { getContacts, getContactsById };