import { httpError } from "../errors/httpError.js";

export const errorHandler = (error, request, response, next) => {
  if (error instanceof httpError) {
    response.status(error.status).json({
      message: error.message,
      status: error.status,
      data: error.data,
    });
    return;
  }

  response.status(500).json({
    message: "Something went wrong",
    status: 500,
  });
};
