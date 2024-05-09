import {
  registerForEvent
} from "./chunk-KSXK64P7.mjs";
import {
  errorHandler
} from "./chunk-GQL5UW5T.mjs";
import {
  checkIn
} from "./chunk-YRI3BFWT.mjs";
import {
  createEvent
} from "./chunk-UPHDSGM6.mjs";
import "./chunk-OLHHCX5H.mjs";
import {
  getAttenddeBadge
} from "./chunk-QUWY3T7B.mjs";
import {
  getEventAttenddes
} from "./chunk-W7DIXDMQ.mjs";
import {
  getEvent
} from "./chunk-BHEXL2AA.mjs";
import "./chunk-F2LQ4BNN.mjs";
import "./chunk-X66UGK5S.mjs";

// src/server.ts
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
var app = fastify().withTypeProvider();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Pass.In",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttenddeBadge);
app.register(checkIn);
app.register(getEventAttenddes);
app.setErrorHandler(errorHandler);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => console.log("\u{1F525} Server Running \u{1F525}"));
