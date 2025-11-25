import { httpError } from "../errors/httpError.js";

export const notFoundHandler = (error, request, response, next) => {
  if (error instanceof httpError) {
    response.status(error.status).json({
      message: error.message,
      status: error.status,
      data: error.data,
    });
    return;
  }

  response.status(404).json({
    message: "Contact not found",
    status: 404,
  });
};
