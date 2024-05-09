import {
  BadRequest
} from "./chunk-F2LQ4BNN.mjs";

// src/error/error-handler.ts
import { ZodError } from "zod";
var errorHandler = (error, req, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: `Error during validation`,
      errors: error.flatten().fieldErrors
    });
  }
  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message });
  }
  return reply.status(500).send({ message: "Internal server error" });
};

export {
  errorHandler
};
