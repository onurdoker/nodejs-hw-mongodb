import { UserCollection } from "../db/models/User.js";
import { httpError } from "../errors/httpError.js";
import bcrypt from "bcrypt";
import SessionsCollection from "../db/models/Sessions.js";
import { randomBytes } from "node:crypto";
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";

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
    throw httpError(401, "Invalid password!");
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
