export const validatorBody = (schema) => async (request, response, next) => {
  try {
    await schema.validateAsync(request.body, { abortEarly: false });
    next();
  } catch (error) {
    const details = error.details || [];

    response.status(400).send({
      message: "Validation Error",
      status: 400,
      data: details.map((detail) => detail.message),
    });
  }
};
