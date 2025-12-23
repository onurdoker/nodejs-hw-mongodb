export class HttpError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "HttpError";
  }
}

export const httpError = (status, message, data = null) => {
  return new HttpError(status, message, data);
};
