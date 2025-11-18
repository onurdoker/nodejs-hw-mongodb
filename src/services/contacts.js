import Contacts from "../db/models/Contacts.js";

const getContacts = async () => {
  return await Contacts.find();
};

const getContactsById = async (id) => {
  return await Contacts.findById(id);
};

export { getContacts, getContactsById };