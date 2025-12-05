import { registerUser, loginUser, logoutUser, refreshUser } from "../services/auth.js";

export const registerUserController = async (request, response) => {
  const contactData = request.body;

  const newContact = await registerUser(contactData);
  response.status(201).send({
    message: "Successfully registered a user!",
    status: 201,
    data: newContact,
  });
};

export const loginUserController = async (request, response) => {
  const session = await loginUser(request.body);

  response.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  response.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  response.status(200).send({
    message: "Successfully logged in an user! ",
    status: 200,
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (request, response) => {
  const { sessionId } = request.cookies;

  await logoutUser(sessionId);

  response.clearCookie("refreshToken");
  response.clearCookie("sessionId");

  response.status(204).send({
    status: 204,
  });
};

export const refreshUserController = async (request, response) => {
  const { refreshToken, sessionId } = request.cookies;

  const session = await refreshUser({ refreshToken, sessionId });

  response.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  response.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  response.status(200).send({
    message: "Successfully refreshed a session!",
    status: 200,
    data: {
      accessToken: session.accessToken,
    },
  });
};
