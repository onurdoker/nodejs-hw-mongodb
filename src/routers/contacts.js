import { Router } from "express";

import {
  getContactsController,
  getContactsByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validators/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";

const contactRouter = Router();

contactRouter.get("/", ctrlWrapper(getContactsController));

contactRouter.get("/:contactId", isValidId, ctrlWrapper(getContactsByIdController));
contactRouter.post("/", validateBody(createContactSchema), ctrlWrapper(createContactController));
contactRouter.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));
contactRouter.patch("/:contactId", isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));

export default contactRouter;
