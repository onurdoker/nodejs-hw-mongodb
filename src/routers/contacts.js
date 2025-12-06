import { Router } from "express";

import {
  getContactsController,
  getContactsByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
} from "../controllers/contacts.js";
import { authenticate } from "../middlewares/authenticate.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validatorBody } from "../middlewares/validatorBody.js";
import { createContactSchema, updateContactSchema } from "../validators/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";

const contactRouter = Router();
contactRouter.use(authenticate);

contactRouter.get("/", ctrlWrapper(getContactsController));

contactRouter.get("/:contactId", isValidId, ctrlWrapper(getContactsByIdController));
contactRouter.post(
  "/",
  validatorBody(createContactSchema),
  ctrlWrapper(createContactController)
);
contactRouter.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));
contactRouter.patch(
  "/:contactId",
  isValidId,
  validatorBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

export default contactRouter;
