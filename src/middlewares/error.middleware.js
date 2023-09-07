import EErrors from "../services/errors/enums.js";

export default (error, request, response, next) => {
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      response
        .status(400)
        .send({
          status: "error",
          error: error.name,
          cause: error.cause,
          code: error.code,
        });
      break;
    default:
      response.send({ status: "error", error: "Unhandled error" });
      break;
  }
};
