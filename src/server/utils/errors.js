// server/utils/errors.js
export class NotFoundError extends Error {
    constructor(message = "Not Found") {
      super(message);
      this.statusCode = 404;
    }
  }
  
  export class BadRequestError extends Error {
    constructor(message = "Bad Request") {
      super(message);
      this.statusCode = 400;
    }
  }
  