import { UserCollection } from "../db/models/User.js";
import { httpError } from "../errors/httpError.js";
import bcrypt from "bcrypt";
import SessionsCollection from "../db/models/Sessions.js";
import { randomBytes } from "node:crypto";
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";
import { sendMail } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import path from "node:path";
import fs from "node:fs/promises";
import handlebars from "handlebars";

export const registerUser = async (userData) => {
  const { email, password } = userData;

  const isUserExist = await UserCollection.findOne({ email });

  if (isUserExist) {
    throw httpError(409, "Email in use!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await UserCollection.create({ ...userData, password: hashedPassword });
};

export const loginUser = async (userData) => {
  const { email, password } = userData;

  const isUserExist = await UserCollection.findOne({ email });

  if (!isUserExist) {
    throw httpError(404, "User not found!");
  }

  const isPasswordValid = await bcrypt.compare(password, isUserExist.password);

  if (!isPasswordValid) {
    throw new httpError(401, "Invalid password!");
  }

  await SessionsCollection.deleteMany({ usedId: isUserExist._id });

  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");
  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + THIRTY_DAYS);

  const session = await SessionsCollection.create({
    userId: isUserExist._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.findByIdAndDelete(sessionId);
};

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw httpError(404, "Session not found");
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw httpError(401, "Refresh token expired");
  }

  const accessTokenNew = randomBytes(30).toString("base64");
  const refreshTokenNew = randomBytes(30).toString("base64");
  const accessTokenValidUntilNew = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntilNew = new Date(Date.now() + THIRTY_DAYS);

  const sessionNew = await SessionsCollection.create({
    userId: session.userId,
    accessToken: accessTokenNew,
    refreshToken: refreshTokenNew,
    accessTokenValidUntil: accessTokenValidUntilNew,
    refreshTokenValidUntil: refreshTokenValidUntilNew,
  });

  await SessionsCollection.findByIdAndDelete(sessionId);

  return sessionNew;
};

const TEMPLATE_DIR = path.join(process.cwd(), "src", "templates");

export const requestResetEmail = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw httpError(404, "User not found!");
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5m",
    }
  );

  const templatePath = path.join(TEMPLATE_DIR, "reset-password-mail.html");
  const templateContent = await fs.readFile(templatePath, "utf-8");
  const template = handlebars.compile(templateContent.toString());

  const htmlContent = template({
    name: user.name,
    url: `${process.env.APP_DOMAIN}/auth/reset-password?token=${resetToken}`,
  });

  await sendMail({
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: "Reset Password Email From Template",
    html: htmlContent,
  });

  return resetToken;
};

export const resetPassword = async (token, newPassword) => {
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new httpError(401, "Token expired");
    } else {
      throw new httpError(401, "Invalid Token");
    }
  }

  const userId = decodedToken.sub;
  const userEmail = decodedToken.email;

  const user = await UserCollection.findOne({
    _id: userId,
    email: userEmail,
  });

  if (!user) {
    throw httpError(404, "User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await UserCollection.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });

  return true;
};
