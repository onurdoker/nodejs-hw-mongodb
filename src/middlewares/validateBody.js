export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    res.status(400).send({
      message: "Validation error",
      status: 400,
      data: error.details.map((detail) => detail.message),
    });
  }
};
