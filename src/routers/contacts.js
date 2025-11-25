import { Router } from "express";
import {
  getContactsController,
  getContactsByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
} from "../controllers/contacts.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const contactRouter = Router();

contactRouter.get("/", ctrlWrapper(getContactsController));
contactRouter.get("/:contactId", ctrlWrapper(getContactsByIdController));
contactRouter.post("/", ctrlWrapper(createContactController));
contactRouter.delete("/:contactId", ctrlWrapper(deleteContactController));
contactRouter.patch("/:contactId", ctrlWrapper(updateContactController));

export default contactRouter;
