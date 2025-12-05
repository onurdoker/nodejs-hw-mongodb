/* eslint-disable no-unused-vars */
export const notFoundHandler = (request, response, next) => {
  response.status(404).json({
    message: "Contact not found",
    status: 404,
  });
};
