import { httpError } from "../errors/httpError.js";
import SessionCollection from "../db/models/Sessions.js";
import { UserCollection } from "../db/models/User.js";

export const authorize = async (request, response, next) => {
  try {
    const authorization = request.get("Authorization");

    if (!authorization) {
      throw new httpError(401, "Authorization header is missing");
    }

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      throw new httpError(401, "Invalid authorization header");
    }

    const session = await SessionCollection.findOne({ accessToken: token });

    if (!session) {
      throw new httpError(401, "Invalid Access Token");
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw new httpError(401, "Access Token is expired");
    }

    const user = await UserCollection.findById(session.userId);

    if (!user) {
      throw new httpError(401, "Invalid User");
    }

    request.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
