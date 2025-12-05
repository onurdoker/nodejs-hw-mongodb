import { Router } from "express";
import { validatorBody } from "../middlewares/validatorBody.js";
import { createUserSchema, loginUserSchema } from "../validators/users.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  registerUserController,
  loginUserController,
  refreshUserController,
  logoutUserController,
} from "../controllers/auth.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validatorBody(createUserSchema),
  ctrlWrapper(registerUserController)
);

authRouter.post(
  "/login",
  validatorBody(loginUserSchema),
  ctrlWrapper(loginUserController)
);

authRouter.post("/refresh", ctrlWrapper(refreshUserController));

authRouter.post("/logout", ctrlWrapper(logoutUserController));

export default authRouter;
